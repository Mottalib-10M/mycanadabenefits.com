/**
 * Calculateur de l'accueil : « tout ce que je touche ». Additionne, pour un ménage, l'ACE, l'ACEBE,
 * l'ACT, la prestation provinciale pour enfants, les crédits provinciaux, la SV, le SRG et
 * l'Allocation selon l'âge. Une prestation dont la province ne publie pas le taux de réduction est
 * montrée à part (plafond), jamais additionnée au total.
 */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import * as M from '../../lib/engine/index';
import { P } from '../../lib/engine/params';
import { num, str } from '../../lib/url-state';
import { Shell, Row2, Head, Note, MethodLink, disclaimer, eur, type L } from './kit';
import { provOptions, tr } from './labels';
import { useEffect } from 'react';
import { readParams, updateURL } from '../../lib/url-state';

type Age = 'u60' | '60' | '65' | '75';
interface Line { label: string; annual: number; note?: string; capped?: boolean; href?: string }

export function computeAll(o: { prov: M.Province; couple: boolean; age: Age; spouseAge: Age; u6: number; o6: number; income: number; work: number; spouseWork: number; rent: number }, lang: L): Line[] {
  const { prov, couple, age, spouseAge, u6, o6, income, work, spouseWork, rent } = o;
  const kids = u6 + o6;
  const lines: Line[] = [];
  const senior = (a: Age) => a === '65' || a === '75';
  // Pensions d'abord : la SV et le SRG entrent dans le revenu net qui sert aux crédits de l'ARC.
  let pensions = 0;
  const oasOf = (a: Age) => (senior(a) ? M.oas({ years: 40, startAge: 65, age75: a === '75', netIncome: income }).net * 12 : 0);
  const oasYou = oasOf(age), oasSp = couple ? oasOf(spouseAge) : 0;
  if (oasYou + oasSp > 0) { lines.push({ label: tr(lang, 'Old Age Security (full pension)', 'Sécurité de la vieillesse (pension complète)'), annual: oasYou + oasSp }); pensions += oasYou + oasSp; }
  const gisIncome = Math.max(0, income - M.gisWorkExemption(work) - (couple ? M.gisWorkExemption(spouseWork) : 0));
  let gisTotal = 0, allowanceTotal = 0;
  const kindFor = (me: Age, other: Age): M.GisCase => (!couple ? 'single' : senior(other) ? 'spouse_oas' : other === '60' ? 'spouse_allowance' : 'spouse_no_oas');
  if (senior(age)) gisTotal += M.gis(kindFor(age, spouseAge), gisIncome).monthly * 12;
  if (couple && senior(spouseAge)) gisTotal += M.gis(kindFor(spouseAge, age), gisIncome).monthly * 12;
  if (couple && age === '60' && senior(spouseAge)) allowanceTotal += M.allowance(false, gisIncome).monthly * 12;
  if (couple && spouseAge === '60' && senior(age)) allowanceTotal += M.allowance(false, gisIncome).monthly * 12;
  if (gisTotal > 0) lines.push({ label: tr(lang, 'Guaranteed Income Supplement', 'Supplément de revenu garanti'), annual: gisTotal });
  if (allowanceTotal > 0) lines.push({ label: tr(lang, 'Allowance (spouse aged 60 to 64)', 'Allocation (conjoint de 60 à 64 ans)'), annual: allowanceTotal });
  pensions += gisTotal + allowanceTotal;
  const afni = income + pensions;
  const c = M.ccb({ under6: u6, age6to17: o6, afni });
  if (kids) lines.push({ label: tr(lang, 'Canada child benefit', 'Allocation canadienne pour enfants'), annual: c.annual });
  lines.push({ label: tr(lang, 'Groceries and Essentials Benefit', 'Allocation pour l’épicerie et les besoins essentiels'), annual: M.cgeb({ couple, children: kids, afni }).annual });
  if (!['qc', 'ab', 'nu'].includes(prov)) {
    const w = M.cwb({ family: couple || kids > 0, working: work, spouseWorking: couple ? spouseWork : 0, afni: Math.max(afni, work + spouseWork) });
    if (w.total > 0) lines.push({ label: tr(lang, 'Canada workers benefit (2026)', 'Allocation canadienne pour les travailleurs (2026)'), annual: w.total });
  } else if (work > 3000) lines.push({ label: tr(lang, 'Canada workers benefit: provincial rates, not modelled', 'Allocation pour les travailleurs : barème provincial, non modélisé'), annual: 0, capped: true });
  // Province
  if (prov === 'on') {
    const t = M.trillium({ couple, children: kids, afni, rent, senior: senior(age) });
    lines.push({ label: tr(lang, 'Ontario Trillium Benefit', 'Prestation Trillium de l’Ontario'), annual: t.annual });
    if (kids) { const ocb = M.ontarioChildBenefit(kids, afni); lines.push({ label: tr(lang, 'Ontario Child Benefit', 'Prestation ontarienne pour enfants'), annual: ocb.max, capped: ocb.partial }); }
    if (senior(age) || (couple && senior(spouseAge))) { const g = P.prov.on.gains; const lim = couple ? g.income_max_couple : g.income_max_single; if (income < lim) lines.push({ label: tr(lang, 'Ontario GAINS (maximum)', 'RRAG de l’Ontario (maximum)'), annual: g.max_month * 12 * ((senior(age) ? 1 : 0) + (couple && senior(spouseAge) ? 1 : 0)), capped: income > 0 }); }
  } else if (prov === 'qc' && kids) {
    const a = M.quebecFamilyAllowance(kids, !couple, afni);
    lines.push({ label: tr(lang, 'Quebec family allowance', 'Allocation famille du Québec'), annual: a.partial ? a.min : a.max, capped: a.partial, note: a.partial ? tr(lang, 'guaranteed minimum shown', 'minimum garanti affiché') : undefined });
  } else if (prov === 'bc' && kids) {
    lines.push({ label: tr(lang, 'BC family benefit', 'Allocation familiale de la C.-B.'), annual: M.bcFamilyBenefit(kids, afni, !couple).annual });
  } else if (prov === 'ab' && kids) {
    const a = M.albertaChildFamilyBenefit(kids, afni, work + spouseWork);
    lines.push({ label: tr(lang, 'Alberta child and family benefit', 'Allocation pour enfants et familles de l’Alberta'), annual: a.base + a.work, capped: a.basePartial || a.workPartial });
  } else if (prov === 'nb') {
    lines.push({ label: tr(lang, 'New Brunswick HST credit', 'Crédit pour la TVH du Nouveau-Brunswick'), annual: M.nbHstCredit(couple, kids, afni) });
  } else if (prov === 'ns') {
    lines.push({ label: tr(lang, 'Nova Scotia affordable living tax credit', 'Crédit pour la vie abordable de la Nouvelle-Écosse'), annual: M.nsAffordableLiving(kids, afni) });
  }
  if (kids && ['nb', 'ns', 'pe', 'nl', 'yt', 'nt', 'nu'].includes(prov)) {
    const m = M.provinceChildMax(prov, kids, u6);
    lines.push({ label: tr(lang, 'Provincial child benefit (maximum)', 'Prestation provinciale pour enfants (maximum)'), annual: m.annualMax, capped: m.threshold !== null && afni > m.threshold });
  }
  return lines;
}

export default function AllBenefits({ lang = 'en', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number) => eur(x, lang);
  const [prov, setProv] = useState<M.Province>('on');
  const [couple, setCouple] = useState('1');
  const [age, setAge] = useState<Age>('u60'); const [spouseAge, setSpouseAge] = useState<Age>('u60');
  const [u6, setU6] = useState(1); const [o6, setO6] = useState(1);
  const [income, setIncome] = useState(60000); const [work, setWork] = useState(40000); const [spouseWork, setSpouseWork] = useState(20000); const [rent, setRent] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setProv(str(u, 'p', 'on') as M.Province); setCouple(str(u, 'c', '1')); setAge(str(u, 'a', 'u60') as Age); setSpouseAge(str(u, 'sa', 'u60') as Age);
    setU6(num(u, 'u6', 1)); setO6(num(u, 'o6', 1)); setIncome(num(u, 'i', 60000)); setWork(num(u, 'w', 40000)); setSpouseWork(num(u, 'sw', 20000)); setRent(num(u, 'r', 0)); }, []);
  useEffect(() => { updateURL({ p: prov, c: couple, a: age, sa: spouseAge, u6, o6, i: income, w: work, sw: spouseWork, r: rent }); }, [prov, couple, age, spouseAge, u6, o6, income, work, spouseWork, rent]);
  const lines = useMemo(() => computeAll({ prov, couple: couple === '1', age, spouseAge, u6, o6, income, work, spouseWork: couple === '1' ? spouseWork : 0, rent }, lang), [prov, couple, age, spouseAge, u6, o6, income, work, spouseWork, rent, lang]);
  const total = lines.filter((l) => !l.capped).reduce((s, l) => s + l.annual, 0);
  const ageOpts = [['u60', 'Under 60', 'Moins de 60 ans'], ['60', '60 to 64', '60 à 64 ans'], ['65', '65 to 74', '65 à 74 ans'], ['75', '75 or over', '75 ans ou plus']].map(([v, en, fr]) => ({ value: v, label: tr(lang, en, fr) }));
  return (
    <Shell id="all" form={<>
      <Row2>
        <SelectField id="all-p" label={tr(lang, 'Province or territory', 'Province ou territoire')} value={prov} onChange={(v) => setProv(v as M.Province)} options={provOptions(lang)} />
        <Toggle id="all-c" label={tr(lang, 'Household', 'Ménage')} value={couple} onChange={setCouple} options={[{ value: '0', label: tr(lang, 'Single', 'Seul') }, { value: '1', label: tr(lang, 'Couple', 'Couple') }]} />
      </Row2>
      <Row2>
        <SelectField id="all-a" label={tr(lang, 'Your age', 'Votre âge')} value={age} onChange={(v) => setAge(v as Age)} options={ageOpts} />
        {couple === '1' ? <SelectField id="all-sa" label={tr(lang, 'Spouse’s age', 'Âge du conjoint')} value={spouseAge} onChange={(v) => setSpouseAge(v as Age)} options={ageOpts} /> : <span />}
      </Row2>
      <Row2>
        <NumberField id="all-u6" label={tr(lang, 'Children under 6', 'Enfants de moins de 6 ans')} value={u6} onChange={setU6} max={10} lang={lang} />
        <NumberField id="all-o6" label={tr(lang, 'Children aged 6 to 17', 'Enfants de 6 à 17 ans')} value={o6} onChange={setO6} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="all-i" label={tr(lang, 'Family net income 2025', 'Revenu familial net 2025')} value={income} onChange={setIncome} unit="$" max={2000000} help={tr(lang, 'Line 23600, not counting OAS or GIS.', 'Ligne 23600, sans la SV ni le SRG.')} lang={lang} />
        <NumberField id="all-w" label={tr(lang, 'Your working income', 'Votre revenu de travail')} value={work} onChange={setWork} unit="$" max={2000000} lang={lang} />
      </Row2>
      <Row2>
        {couple === '1' ? <NumberField id="all-sw" label={tr(lang, 'Spouse’s working income', 'Revenu de travail du conjoint')} value={spouseWork} onChange={setSpouseWork} unit="$" max={2000000} lang={lang} /> : <span />}
        {prov === 'on' ? <NumberField id="all-r" label={tr(lang, 'Rent paid in 2025', 'Loyer payé en 2025')} value={rent} onChange={setRent} unit="$" max={500000} lang={lang} /> : <span />}
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'What your household receives, per month', 'Ce que votre ménage reçoit, par mois')} value={$(total / 12)} sub={`${$(total)} ${tr(lang, 'a year', 'par an')}`} />
      <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {lines.map((l) => <tr key={l.label}><td className="py-1.5 pr-3 text-navy-700">{l.label}{l.capped ? ' *' : ''}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{l.capped && l.annual === 0 ? '—' : `${$(l.annual / 12)}`}</td></tr>)}
      </tbody></table>
      <Note>{tr(lang, 'Monthly average of each annual amount. * Not added to the total: the province publishes no reduction rate, or the rate is not federal. Full OAS assumed (40 years in Canada). ', 'Moyenne mensuelle de chaque montant annuel. * Non additionné : la province ne publie pas son taux de réduction, ou le barème n’est pas fédéral. SV complète supposée (40 ans au Canada). ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
