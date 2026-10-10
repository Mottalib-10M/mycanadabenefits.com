/**
 * Calculateurs complets des pages outils (un par prestation). Chacun lit le moteur (lib/engine),
 * jamais un second calcul. Premier rendu = valeurs par défaut (RECETTE §17.5), puis l'URL partagée.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import * as M from '../../lib/engine/index';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, yesNo, disclaimer, eur, type L } from './kit';
import { tr } from './labels';
import { jourMois } from '../../lib/minis/_kit';

type Props = { lang?: L; methodHref?: string };
const pct = (x: number, l: L, d = 1) => `${(x * 100).toLocaleString(l === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: d })} %`;
/** Petit crochet : lit les paramètres du lien partagé une fois monté, puis tient l'URL à jour. */
function useShare(read: (u: URLSearchParams) => void, state: Record<string, string | number>) {
  useEffect(() => { const u = readParams(window.location.search); if ([...u.keys()].length) read(u); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { updateURL(state); }, [JSON.stringify(state)]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function CcbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [u6, setU6] = useState(1); const [o6, setO6] = useState(1); const [afni, setAfni] = useState(55000); const [dis, setDis] = useState(0);
  useShare((u) => { setU6(num(u, 'u6', 1)); setO6(num(u, 'o6', 1)); setAfni(num(u, 'i', 55000)); setDis(num(u, 'd', 0)); }, { u6, o6, i: afni, d: dis });
  const r = useMemo(() => M.ccb({ under6: u6, age6to17: o6, afni, disabled: dis }), [u6, o6, afni, dis]);
  const band = [tr(lang, 'no reduction (income at or under $38,237)', 'aucune réduction (revenu de 38 237 $ ou moins)'), tr(lang, 'first reduction band', 'première tranche de réduction'), tr(lang, 'second reduction band (over $82,847)', 'seconde tranche de réduction (plus de 82 847 $)')][r.band];
  return (
    <Shell id="ccb" form={<>
      <Row2>
        <NumberField id="ccb-u6" label={tr(lang, 'Children under 6', 'Enfants de moins de 6 ans')} value={u6} onChange={setU6} max={10} lang={lang} />
        <NumberField id="ccb-o6" label={tr(lang, 'Children aged 6 to 17', 'Enfants de 6 à 17 ans')} value={o6} onChange={setO6} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="ccb-i" label={tr(lang, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} help={tr(lang, 'Line 23600 of both spouses’ 2025 returns.', 'Ligne 23600 des déclarations 2025 des deux conjoints.')} lang={lang} />
        <NumberField id="ccb-d" label={tr(lang, 'Children eligible for the DTC', 'Enfants admissibles au CIPH')} value={dis} onChange={setDis} max={10} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'Canada child benefit per month', 'Allocation canadienne pour enfants par mois')} value={$(r.monthly)} sub={`${$(r.annual)} ${tr(lang, 'for July 2026 to June 2027', 'de juillet 2026 à juin 2027')}`} />
      <Rows rows={[
        [tr(lang, 'Maximum for your children', 'Maximum pour vos enfants'), $(r.max)],
        [tr(lang, 'Income-tested reduction', 'Réduction selon le revenu'), `− ${$(r.reduction)}`],
        ...(r.cdb > 0 ? [[tr(lang, 'Child disability benefit', 'Prestation pour enfants handicapés'), $(r.cdb)] as [string, string]] : []),
        [tr(lang, 'Total for the year', 'Total de l’année'), $(r.annual), true],
      ]} />
      <Note>{band}{r.lumpSum ? tr(lang, '. Under $240 for the year: paid in one sum in July.', '. Moins de 240 $ pour l’année : versé en une fois en juillet.') : '.'} {disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function CgebCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [couple, setCouple] = useState('0'); const [kids, setKids] = useState(0); const [afni, setAfni] = useState(30000);
  useShare((u) => { setCouple(str(u, 'c', '0')); setKids(num(u, 'k', 0)); setAfni(num(u, 'i', 30000)); }, { c: couple, k: kids, i: afni });
  const r = useMemo(() => M.cgeb({ couple: couple === '1', children: kids, afni }), [couple, kids, afni]);
  return (
    <Shell id="cgeb" form={<>
      <Row2>
        <Toggle id="cg-c" label={tr(lang, 'Marital status', 'Situation')} value={couple} onChange={setCouple} options={[{ value: '0', label: tr(lang, 'Single', 'Seul') }, { value: '1', label: tr(lang, 'Couple', 'Couple') }]} />
        <NumberField id="cg-k" label={tr(lang, 'Children under 19', 'Enfants de moins de 19 ans')} value={kids} onChange={setKids} max={10} lang={lang} />
      </Row2>
      <NumberField id="cg-i" label={tr(lang, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} help={tr(lang, 'Your line 23600, plus your spouse’s if you have one.', 'Votre ligne 23600, plus celle du conjoint s’il y a lieu.')} lang={lang} />
    </>} result={<>
      <Head label={tr(lang, 'Groceries and Essentials Benefit per quarter', 'Allocation pour l’épicerie par trimestre')} value={$(r.quarterly, 2)} sub={`${$(r.annual, 2)} ${tr(lang, 'for the year (July 2026 to April 2027)', 'pour l’année (juillet 2026 à avril 2027)')}`} />
      <Rows rows={[
        [tr(lang, 'Adult and child amounts', 'Montants adultes et enfants'), $(r.base)],
        [tr(lang, 'Single supplement', 'Supplément pour personne seule'), $(r.supplement, 2)],
        [tr(lang, `Reduction (5% over ${$(P.cgeb.threshold)})`, `Réduction (5 % au-delà de ${$(P.cgeb.threshold)})`), `− ${$(r.reduction, 2)}`],
      ]} />
      <Note>{tr(lang, 'Paid in July, October, January and April. ', 'Versée en juillet, octobre, janvier et avril. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function CwbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [fam, setFam] = useState('0'); const [work, setWork] = useState(18000); const [afni, setAfni] = useState(20000); const [sp, setSp] = useState(0); const [dis, setDis] = useState('0');
  useShare((u) => { setFam(str(u, 'f', '0')); setWork(num(u, 'w', 18000)); setAfni(num(u, 'i', 20000)); setSp(num(u, 's', 0)); setDis(str(u, 'd', '0')); }, { f: fam, w: work, i: afni, s: sp, d: dis });
  const r = useMemo(() => M.cwb({ family: fam === '1', working: work, afni: Math.max(afni, work + (fam === '1' ? sp : 0)), spouseWorking: sp, disability: dis === '1' }), [fam, work, afni, sp, dis]);
  return (
    <Shell id="cwb" form={<>
      <Row2>
        <Toggle id="cw-f" label={tr(lang, 'Spouse or child at home', 'Conjoint ou enfant à charge')} value={fam} onChange={setFam} options={yesNo(lang)} />
        <Toggle id="cw-d" label={tr(lang, 'Approved for the DTC', 'Admis au CIPH')} value={dis} onChange={setDis} options={yesNo(lang)} />
      </Row2>
      <Row2>
        <NumberField id="cw-w" label={tr(lang, 'Your 2026 working income', 'Votre revenu de travail 2026')} value={work} onChange={setWork} unit="$" max={500000} help={tr(lang, 'Employment and self-employment earnings.', 'Salaires et revenus d’entreprise.')} lang={lang} />
        <NumberField id="cw-i" label={tr(lang, 'Family net income 2026', 'Revenu familial net 2026')} value={afni} onChange={setAfni} unit="$" max={1000000} help={tr(lang, 'Never below the working income entered.', 'Jamais inférieur au revenu de travail saisi.')} lang={lang} />
      </Row2>
      {fam === '1' && <NumberField id="cw-s" label={tr(lang, 'Spouse’s working income', 'Revenu de travail du conjoint')} value={sp} onChange={setSp} unit="$" max={500000} lang={lang} />}
    </>} result={<>
      <Head label={tr(lang, 'Canada workers benefit for 2026', 'Allocation canadienne pour les travailleurs 2026')} value={$(r.total)} sub={tr(lang, `up to ${$(r.advanceMax)} of it as advance payments`, `dont jusqu’à ${$(r.advanceMax)} en paiements anticipés`)} />
      <Rows rows={[
        [tr(lang, 'Basic amount', 'Montant de base'), $(r.basic)],
        [tr(lang, 'Disability supplement', 'Supplément pour invalidité'), $(r.disability)],
        [tr(lang, 'Income used for the reduction', 'Revenu retenu pour la réduction'), $(r.adjustedIncome)],
      ]} />
      <Note>{tr(lang, 'General federal rates: Quebec, Alberta and Nunavut use their own and are not modelled. ', 'Barème fédéral général : le Québec, l’Alberta et le Nunavut ont le leur, non modélisé. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function CppCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [at65, setAt65] = useState(Math.round(P.cpp.avg_65)); const [age, setAge] = useState(65); const [to, setTo] = useState(85);
  useShare((u) => { setAt65(num(u, 'p', Math.round(P.cpp.avg_65))); setAge(num(u, 'a', 65)); setTo(num(u, 't', 85)); }, { p: at65, a: age, t: to });
  const r = useMemo(() => M.cppPension(at65, age), [at65, age]);
  const ages = [60, 65, 70];
  return (
    <Shell id="cpp" form={<>
      <NumberField id="cpp-p" label={tr(lang, 'Your estimated CPP at 65, per month', 'Votre RPC estimé à 65 ans, par mois')} value={at65} onChange={setAt65} unit="$" max={P.cpp.max_65} decimals={2} help={tr(lang, 'Shown in your My Service Canada Account statement.', 'Indiqué dans votre relevé de Mon dossier Service Canada.')} lang={lang} />
      <Row2>
        <SelectField id="cpp-a" label={tr(lang, 'Age you start', 'Âge de début')} value={String(age)} onChange={(v) => setAge(Number(v))} options={Array.from({ length: 11 }, (_, i) => ({ value: String(60 + i), label: String(60 + i) }))} />
        <SelectField id="cpp-t" label={tr(lang, 'Count payments up to age', 'Compter jusqu’à l’âge de')} value={String(to)} onChange={(v) => setTo(Number(v))} options={[75, 80, 85, 90, 95].map((x) => ({ value: String(x), label: String(x) }))} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, `CPP retirement pension at ${age}`, `Pension de retraite du RPC à ${age} ans`)} value={$(r.monthly)} sub={tr(lang, `per month, ${pct(r.factor - 1, lang)} versus 65`, `par mois, ${pct(r.factor - 1, lang)} par rapport à 65 ans`)} />
      <Rows rows={ages.map((a) => [tr(lang, `Start at ${a}: total to ${to}`, `Début à ${a} ans : total jusqu’à ${to} ans`), $(M.cppCumulative(at65, a, to))] as [string, string])} />
      <Note>{tr(lang, `Starting at 70 overtakes starting at 65 around age ${M.cppBreakEven(at65, 65, 70)}. Figures in 2026 dollars, before indexation and tax. `, `Commencer à 70 ans rattrape un début à 65 ans vers ${M.cppBreakEven(at65, 65, 70).toLocaleString('fr-CA')} ans. Montants en dollars de 2026, avant indexation et impôt. `)}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function OasCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 2) => eur(x, lang, d);
  const [years, setYears] = useState(40); const [age, setAge] = useState(65); const [old, setOld] = useState('0'); const [inc, setInc] = useState(45000);
  useShare((u) => { setYears(num(u, 'y', 40)); setAge(num(u, 'a', 65)); setOld(str(u, 'o', '0')); setInc(num(u, 'i', 45000)); }, { y: years, a: age, o: old, i: inc });
  const r = useMemo(() => M.oas({ years, startAge: age, age75: old === '1', netIncome: inc }), [years, age, old, inc]);
  return (
    <Shell id="oas" form={<>
      <Row2>
        <NumberField id="oas-y" label={tr(lang, 'Years in Canada after 18', 'Années au Canada après 18 ans')} value={years} onChange={setYears} max={60} help={tr(lang, '40 years give the full pension.', '40 ans donnent la pension complète.')} lang={lang} />
        <SelectField id="oas-a" label={tr(lang, 'Age you start', 'Âge de début')} value={String(age)} onChange={(v) => setAge(Number(v))} options={[65, 66, 67, 68, 69, 70].map((x) => ({ value: String(x), label: String(x) }))} />
      </Row2>
      <Row2>
        <Toggle id="oas-o" label={tr(lang, 'Aged 75 or over', '75 ans ou plus')} value={old} onChange={setOld} options={yesNo(lang)} />
        <NumberField id="oas-i" label={tr(lang, 'Net income 2025 (line 23400)', 'Revenu net 2025 (ligne 23400)')} value={inc} onChange={setInc} unit="$" max={2000000} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'OAS pension, October to December 2026', 'Pension de la SV, octobre à décembre 2026')} value={$(r.net)} sub={r.eligible ? tr(lang, 'per month after the recovery tax', 'par mois après l’impôt de récupération') : tr(lang, 'Under 10 years after 18: no pension', 'Moins de 10 ans après 18 ans : pas de pension')} />
      <Rows rows={[
        [tr(lang, 'Share of the full pension', 'Part de la pension complète'), pct(r.fraction, lang, 1)],
        [tr(lang, 'Deferral increase', 'Majoration pour report'), pct(r.deferral, lang, 1)],
        [tr(lang, 'Gross monthly pension', 'Pension mensuelle brute'), $(r.gross)],
        [tr(lang, 'Recovery tax withheld', 'Impôt de récupération retenu'), `− ${$(r.recovery)}`],
      ]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function GisCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 2) => eur(x, lang, d);
  const [kind, setKind] = useState<M.GisCase>('single'); const [inc, setInc] = useState(8000); const [emp, setEmp] = useState(0);
  useShare((u) => { setKind(str(u, 'k', 'single') as M.GisCase); setInc(num(u, 'i', 8000)); setEmp(num(u, 'e', 0)); }, { k: kind, i: inc, e: emp });
  const counted = Math.max(0, inc - M.gisWorkExemption(emp));
  const r = useMemo(() => M.gis(kind, counted), [kind, counted]);
  const opts: Array<[M.GisCase, string, string]> = [['single', 'Single, widowed or divorced', 'Seul, veuf ou divorcé'], ['spouse_oas', 'Spouse also receives OAS', 'Conjoint qui reçoit aussi la SV'], ['spouse_allowance', 'Spouse receives the Allowance', 'Conjoint qui reçoit l’Allocation'], ['spouse_no_oas', 'Spouse receives neither', 'Conjoint qui ne reçoit ni l’une ni l’autre']];
  return (
    <Shell id="gis" form={<>
      <SelectField id="gis-k" label={tr(lang, 'Your situation', 'Votre situation')} value={kind} onChange={(v) => setKind(v as M.GisCase)} options={opts.map(([v, en, fr]) => ({ value: v, label: tr(lang, en, fr) }))} />
      <Row2>
        <NumberField id="gis-i" label={kind === 'single' ? tr(lang, 'Your 2025 income, OAS excluded', 'Votre revenu 2025, hors SV') : tr(lang, 'Couple’s 2025 income, OAS excluded', 'Revenu 2025 du couple, hors SV')} value={inc} onChange={setInc} unit="$" max={200000} help={tr(lang, 'CPP, pensions, interest, RRIF withdrawals, wages.', 'RPC, rentes, intérêts, retraits de FERR, salaires.')} lang={lang} />
        <NumberField id="gis-e" label={tr(lang, 'Of which employment income', 'Dont revenu d’emploi')} value={emp} onChange={setEmp} unit="$" max={200000} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'GIS per month, October to December 2026', 'SRG par mois, octobre à décembre 2026')} value={$(r.monthly)} sub={tr(lang, 'on top of the OAS pension', 'en plus de la pension de la SV')} />
      <Rows rows={[
        [tr(lang, 'Income counted after the work exemption', 'Revenu compté après l’exemption'), eur(counted, lang)],
        [tr(lang, 'Basic supplement', 'Supplément de base'), $(r.basic)],
        [tr(lang, 'Top-up', 'Complément'), $(r.topup)],
        [tr(lang, 'Maximum for this situation', 'Maximum pour cette situation'), $(P.gis[kind].max)],
      ]} />
      <Note>{tr(lang, 'Model fitted to Service Canada’s quarterly table: exact at the maximum and at each published threshold, within about a dollar a month in between. ', 'Modèle calé sur le tableau trimestriel de Service Canada : exact au maximum et à chaque seuil publié, à environ un dollar par mois près entre les deux. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function ClawbackCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [inc, setInc] = useState(110000); const [old, setOld] = useState('0'); const [yr, setYr] = useState('2025');
  useShare((u) => { setInc(num(u, 'i', 110000)); setOld(str(u, 'o', '0')); setYr(str(u, 'y', '2025')); }, { i: inc, o: old, y: yr });
  const annual = (old === '1' ? P.oas.max_75 : P.oas.max_65_74) * 12;
  const rec = useMemo(() => M.oasRecovery(inc, annual, yr === '2026' ? 2026 : 2025), [inc, annual, yr]);
  const thr = yr === '2026' ? P.oas.recovery.thr_2026 : P.oas.recovery.thr_2025;
  return (
    <Shell id="clawback" form={<>
      <NumberField id="cb-i" label={tr(lang, 'Net world income (line 23400)', 'Revenu net mondial (ligne 23400)')} value={inc} onChange={setInc} unit="$" max={2000000} lang={lang} />
      <Row2>
        <SelectField id="cb-y" label={tr(lang, 'Income year', 'Année de revenu')} value={yr} onChange={setYr} options={[{ value: '2025', label: tr(lang, '2025 (July 2026 to June 2027)', '2025 (juillet 2026 à juin 2027)') }, { value: '2026', label: tr(lang, '2026 (July 2027 to June 2028)', '2026 (juillet 2027 à juin 2028)') }]} />
        <Toggle id="cb-o" label={tr(lang, 'Aged 75 or over', '75 ans ou plus')} value={old} onChange={setOld} options={yesNo(lang)} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'OAS recovery tax per year', 'Impôt de récupération de la SV par an')} value={$(rec)} sub={tr(lang, `${$(rec / 12, 2)} withheld each month`, `${$(rec / 12, 2)} retenus chaque mois`)} />
      <Rows rows={[
        [tr(lang, 'Threshold for this income year', 'Seuil de cette année de revenu'), $(thr)],
        [tr(lang, 'Income above the threshold', 'Revenu au-delà du seuil'), $(Math.max(0, inc - thr))],
        [tr(lang, 'Full OAS for the year (Oct.–Dec. 2026 rate)', 'SV complète sur un an (taux oct.–déc. 2026)'), $(annual)],
        [tr(lang, 'OAS you keep', 'SV conservée'), $(annual - rec), true],
      ]} />
      <Note>{tr(lang, '15% of income above the threshold, capped at the pension itself. ', '15 % du revenu au-delà du seuil, plafonné à la pension elle-même. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function RrifCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [val, setVal] = useState(250000); const [age, setAge] = useState(72);
  useShare((u) => { setVal(num(u, 'v', 250000)); setAge(num(u, 'a', 72)); }, { v: val, a: age });
  const r = useMemo(() => M.rrifMinimum(val, age), [val, age]);
  const next = [0, 1, 2, 3, 4].map((k) => { const a = age + k; return [tr(lang, `Factor at ${a}`, `Facteur à ${a} ans`), pct(M.rrifMinimum(1, a).factor, lang, 2)] as [string, string]; });
  return (
    <Shell id="rrif" form={<Row2>
      <NumberField id="rr-v" label={tr(lang, 'RRIF value on January 1', 'Valeur du FERR au 1er janvier')} value={val} onChange={setVal} unit="$" max={50000000} lang={lang} />
      <NumberField id="rr-a" label={tr(lang, 'Age on January 1', 'Âge au 1er janvier')} value={age} onChange={setAge} max={110} help={tr(lang, 'A younger spouse’s age can be used if chosen before the first payment.', 'L’âge d’un conjoint plus jeune peut servir s’il est choisi avant le premier paiement.')} lang={lang} />
    </Row2>} result={<>
      <Head label={tr(lang, 'Minimum withdrawal this year', 'Retrait minimum cette année')} value={$(r.minimum)} sub={tr(lang, `${pct(r.factor, lang, 2)} of the January 1 value`, `${pct(r.factor, lang, 2)} de la valeur au 1er janvier`)} />
      <Rows rows={next} />
      <Note>{tr(lang, 'Factors from section 7308 of the Income Tax Regulations; before 71, 1 ÷ (90 − age). No minimum is required in the year the RRIF is opened. ', 'Facteurs de l’article 7308 du Règlement de l’impôt sur le revenu ; avant 71 ans, 1 ÷ (90 − âge). Aucun minimum l’année d’ouverture du FERR. ')}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function CdbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 2) => eur(x, lang, d);
  const [couple, setCouple] = useState('0'); const [both, setBoth] = useState('0'); const [afni, setAfni] = useState(24000); const [work, setWork] = useState(0); const [age, setAge] = useState(45);
  useShare((u) => { setCouple(str(u, 'c', '0')); setBoth(str(u, 'b', '0')); setAfni(num(u, 'i', 24000)); setWork(num(u, 'w', 0)); setAge(num(u, 'a', 45)); }, { c: couple, b: both, i: afni, w: work, a: age });
  const r = useMemo(() => M.canadaDisabilityBenefit({ couple: couple === '1', bothEligible: both === '1', afni, working: work, age, dtc: true }), [couple, both, afni, work, age]);
  return (
    <Shell id="cdb" form={<>
      <Row2>
        <Toggle id="cd-c" label={tr(lang, 'Spouse or partner', 'Conjoint')} value={couple} onChange={setCouple} options={yesNo(lang)} />
        <NumberField id="cd-a" label={tr(lang, 'Your age', 'Votre âge')} value={age} onChange={setAge} max={110} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="cd-i" label={tr(lang, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} lang={lang} />
        <NumberField id="cd-w" label={tr(lang, 'Working income in it', 'Dont revenu de travail')} value={work} onChange={setWork} unit="$" max={1000000} lang={lang} />
      </Row2>
      {couple === '1' && <Toggle id="cd-b" label={tr(lang, 'Spouse also receives it', 'Le conjoint la reçoit aussi')} value={both} onChange={setBoth} options={yesNo(lang)} />}
    </>} result={<>
      <Head label={tr(lang, 'Canada Disability Benefit per month', 'Prestation canadienne pour personnes handicapées par mois')} value={$(r.monthly)} sub={!r.eligible ? tr(lang, 'Only from 18 to 64, with an approved DTC', 'Seulement de 18 à 64 ans, avec le CIPH approuvé') : tr(lang, 'July 2026 to June 2027', 'Juillet 2026 à juin 2027')} />
      <Rows rows={[
        [tr(lang, 'Maximum per month', 'Maximum par mois'), $(P.cdb.max_month)],
        [tr(lang, 'Income counted after the work exemption', 'Revenu compté après l’exemption de travail'), eur(r.countedIncome, lang)],
        [tr(lang, 'Amount for the year', 'Montant pour l’année'), $(r.annual), true],
      ]} />
      <Note>{tr(lang, 'Assumes the disability tax credit is approved, a condition of the benefit. ', 'Suppose le crédit d’impôt pour personnes handicapées approuvé, condition de la prestation. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function OtbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [couple, setCouple] = useState('0'); const [kids, setKids] = useState(0); const [afni, setAfni] = useState(28000); const [rent, setRent] = useState(18000); const [tax, setTax] = useState(0); const [sen, setSen] = useState('0'); const [north, setNorth] = useState('0');
  useShare((u) => { setCouple(str(u, 'c', '0')); setKids(num(u, 'k', 0)); setAfni(num(u, 'i', 28000)); setRent(num(u, 'r', 18000)); setTax(num(u, 't', 0)); setSen(str(u, 's', '0')); setNorth(str(u, 'n', '0')); }, { c: couple, k: kids, i: afni, r: rent, t: tax, s: sen, n: north });
  const r = useMemo(() => M.trillium({ couple: couple === '1', children: kids, afni, rent, propertyTax: tax, senior: sen === '1', north: north === '1' }), [couple, kids, afni, rent, tax, sen, north]);
  return (
    <Shell id="otb" form={<>
      <Row2>
        <Toggle id="ot-c" label={tr(lang, 'Marital status', 'Situation')} value={couple} onChange={setCouple} options={[{ value: '0', label: tr(lang, 'Single', 'Seul') }, { value: '1', label: tr(lang, 'Couple', 'Couple') }]} />
        <NumberField id="ot-k" label={tr(lang, 'Children under 19', 'Enfants de moins de 19 ans')} value={kids} onChange={setKids} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="ot-i" label={tr(lang, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} lang={lang} />
        <NumberField id="ot-r" label={tr(lang, 'Rent paid in 2025', 'Loyer payé en 2025')} value={rent} onChange={setRent} unit="$" max={500000} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="ot-t" label={tr(lang, 'Property tax paid in 2025', 'Impôt foncier payé en 2025')} value={tax} onChange={setTax} unit="$" max={500000} lang={lang} />
        <Toggle id="ot-s" label={tr(lang, '65 or over', '65 ans ou plus')} value={sen} onChange={setSen} options={yesNo(lang)} />
      </Row2>
      <Toggle id="ot-n" label={tr(lang, 'Living in Northern Ontario', 'Vous vivez dans le Nord de l’Ontario')} value={north} onChange={setNorth} options={yesNo(lang)} />
    </>} result={<>
      <Head label={tr(lang, 'Ontario Trillium Benefit per month', 'Prestation Trillium de l’Ontario par mois')} value={$(r.monthly, 2)} sub={r.lumpSum ? tr(lang, 'Total of $500 or less: paid once, in July 2026', 'Total de 500 $ ou moins : versé en une fois, en juillet 2026') : tr(lang, `${$(r.annual)} from July 2026 to June 2027`, `${$(r.annual)} de juillet 2026 à juin 2027`)} />
      <Rows rows={[
        [tr(lang, 'Energy and property tax credit', 'Crédit pour l’énergie et les impôts fonciers'), $(r.oeptc)],
        [tr(lang, 'Sales tax credit', 'Crédit de taxe de vente'), $(r.ostc)],
        [tr(lang, 'Northern energy credit', 'Crédit pour les coûts d’énergie dans le Nord'), $(r.noec)],
      ]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function QcFaCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [kids, setKids] = useState(2); const [single, setSingle] = useState('0'); const [inc, setInc] = useState(55000);
  useShare((u) => { setKids(num(u, 'k', 2)); setSingle(str(u, 's', '0')); setInc(num(u, 'i', 55000)); }, { k: kids, s: single, i: inc });
  const r = useMemo(() => M.quebecFamilyAllowance(kids, single === '1', inc), [kids, single, inc]);
  return (
    <Shell id="qcfa" form={<>
      <Row2>
        <NumberField id="qf-k" label={tr(lang, 'Children under 18', 'Enfants de moins de 18 ans')} value={kids} onChange={setKids} max={10} lang={lang} />
        <Toggle id="qf-s" label={tr(lang, 'Single-parent family', 'Famille monoparentale')} value={single} onChange={setSingle} options={yesNo(lang)} />
      </Row2>
      <NumberField id="qf-i" label={tr(lang, 'Family income 2025', 'Revenu familial 2025')} value={inc} onChange={setInc} unit="$" max={1000000} lang={lang} />
    </>} result={<>
      <Head label={tr(lang, 'Quebec family allowance 2026', 'Allocation famille 2026')} value={r.partial ? `${$(r.min)} – ${$(r.max)}` : $(r.max)} sub={r.partial ? tr(lang, `Income above ${$(r.threshold)}: between the minimum and the maximum`, `Revenu au-delà de ${$(r.threshold)} : entre le minimum et le maximum`) : tr(lang, 'per year, maximum amount', 'par an, montant maximal')} />
      <Rows rows={[
        [tr(lang, 'Maximum for your family', 'Maximum pour votre famille'), $(r.max)],
        [tr(lang, 'Guaranteed minimum', 'Minimum garanti'), $(r.min)],
        [tr(lang, 'School supplies supplement', 'Supplément pour fournitures scolaires'), $(r.school)],
        [tr(lang, 'Reduction threshold', 'Seuil de réduction'), $(r.threshold)],
      ]} />
      <Note>{tr(lang, 'Retraite Québec does not publish its reduction rate: above the threshold we show the range, and its CalculAide tool gives the exact figure. ', 'Retraite Québec ne publie pas son taux de réduction : au-delà du seuil, nous donnons la fourchette, et son outil CalculAide donne le chiffre exact. ')}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function BcfbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [kids, setKids] = useState(2); const [single, setSingle] = useState('0'); const [afni, setAfni] = useState(60000);
  useShare((u) => { setKids(num(u, 'k', 2)); setSingle(str(u, 's', '0')); setAfni(num(u, 'i', 60000)); }, { k: kids, s: single, i: afni });
  const r = useMemo(() => M.bcFamilyBenefit(kids, afni, single === '1'), [kids, afni, single]);
  return (
    <Shell id="bcfb" form={<>
      <Row2>
        <NumberField id="bc-k" label={tr(lang, 'Children under 18', 'Enfants de moins de 18 ans')} value={kids} onChange={setKids} max={10} lang={lang} />
        <Toggle id="bc-s" label={tr(lang, 'Single parent', 'Parent seul')} value={single} onChange={setSingle} options={yesNo(lang)} />
      </Row2>
      <NumberField id="bc-i" label={tr(lang, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} lang={lang} />
    </>} result={<>
      <Head label={tr(lang, 'BC family benefit per month', 'Allocation familiale de la C.-B. par mois')} value={$(r.monthly, 2)} sub={tr(lang, `${$(r.annual)} from July 2026 to June 2027`, `${$(r.annual)} de juillet 2026 à juin 2027`)} />
      <Rows rows={[
        [tr(lang, 'Maximum for your family', 'Maximum pour votre famille'), $(r.max)],
        [tr(lang, 'Guaranteed between the two thresholds', 'Garanti entre les deux seuils'), $(r.min)],
        [tr(lang, 'Thresholds', 'Seuils'), `${$(P.prov.bc.bcfb.thr1)} · ${$(P.prov.bc.bcfb.thr2)}`],
      ]} />
      <Note>{tr(lang, 'Reduced by 4% of income above each threshold. ', 'Réduite de 4 % du revenu au-delà de chaque seuil. ')}{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

export function AcfbCalc({ lang = 'en', methodHref }: Props) {
  const $ = (x: number, d = 0) => eur(x, lang, d);
  const [kids, setKids] = useState(2); const [afni, setAfni] = useState(25000); const [work, setWork] = useState(20000);
  useShare((u) => { setKids(num(u, 'k', 2)); setAfni(num(u, 'i', 25000)); setWork(num(u, 'w', 20000)); }, { k: kids, i: afni, w: work });
  const r = useMemo(() => M.albertaChildFamilyBenefit(kids, afni, work), [kids, afni, work]);
  const partial = r.basePartial || r.workPartial;
  return (
    <Shell id="acfb" form={<>
      <NumberField id="ab-k" label={tr(lang, 'Children under 18', 'Enfants de moins de 18 ans')} value={kids} onChange={setKids} max={10} lang={lang} />
      <Row2>
        <NumberField id="ab-i" label={tr(lang, 'Family net income 2025', 'Revenu familial net 2025')} value={afni} onChange={setAfni} unit="$" max={1000000} lang={lang} />
        <NumberField id="ab-w" label={tr(lang, 'Family working income 2025', 'Revenu de travail de la famille 2025')} value={work} onChange={setWork} unit="$" max={1000000} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={tr(lang, 'Alberta child and family benefit', 'Allocation pour enfants et familles de l’Alberta')} value={$(r.base + r.work)} sub={partial ? tr(lang, 'upper bound: your income is above a reduction threshold', 'borne haute : votre revenu dépasse un seuil de réduction') : tr(lang, 'per year, July 2026 to June 2027', 'par an, juillet 2026 à juin 2027')} />
      <Rows rows={[
        [tr(lang, 'Base component', 'Composante de base'), `${$(r.base)}${r.basePartial ? ' *' : ''}`],
        [tr(lang, 'Working component (15% over $2,760)', 'Composante travail (15 % au-delà de 2 760 $)'), `${$(r.work)}${r.workPartial ? ' *' : ''}`],
        [tr(lang, 'Reduction thresholds', 'Seuils de réduction'), `${$(P.prov.ab.acfb.base_thr)} · ${$(P.prov.ab.acfb.work_thr)}`],
      ]} />
      <Note>{tr(lang, '* Alberta and the CRA publish the thresholds but not the reduction rates, so an amount marked * is a ceiling, not an estimate. Paid in August, November, February and May.', '* L’Alberta et l’ARC publient les seuils mais pas les taux de réduction : un montant marqué * est un plafond, pas une estimation. Versée en août, novembre, février et mai.')}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

const PAY_LABEL: Record<M.PayKey, [string, string]> = {
  cpp_oas: ['CPP and OAS', 'RPC et SV'], ccb: ['Canada child benefit', 'Allocation canadienne pour enfants'], cgeb: ['GST credit, then CGEB', 'Crédit TPS, puis ACEBE'], acwb: ['Advanced workers benefit', 'Paiements anticipés de l’ACT'],
  otb: ['Ontario Trillium Benefit', 'Prestation Trillium de l’Ontario'], acfb: ['Alberta child and family benefit', 'Allocation de l’Alberta (ACFB)'], cdb: ['Canada Disability Benefit', 'Prestation canadienne pour personnes handicapées'], nldb: ['NL disability benefit', 'Prestation d’invalidité de T.-N.-L.'],
};
export const payLabel = (k: M.PayKey, l: L) => PAY_LABEL[k][l === 'fr' ? 1 : 0];

export function DatesCalc({ lang = 'en' }: Props) {
  const [from, setFrom] = useState(__BUILD_DAY__); const [keys, setKeys] = useState<string>('all');
  useEffect(() => { setFrom(new Date().toISOString().slice(0, 10)); }, []);
  const list = useMemo(() => M.upcoming(from, keys === 'all' ? M.PAY_KEYS : [keys as M.PayKey]).slice(0, 12), [from, keys]);
  return (
    <Shell id="dates" form={<>
      <SelectField id="dt-k" label={tr(lang, 'Benefit', 'Prestation')} value={keys} onChange={setKeys} options={[{ value: 'all', label: tr(lang, 'All benefits', 'Toutes les prestations') }, ...M.PAY_KEYS.map((k) => ({ value: k, label: payLabel(k, lang) }))]} />
      <p className="text-sm text-navy-700">{tr(lang, 'Dates published by the CRA and Service Canada for 2026. 2027 dates are not out yet.', 'Dates publiées par l’ARC et Service Canada pour 2026. Celles de 2027 ne sont pas encore publiées.')}</p>
    </>} result={<>
      <Head label={tr(lang, 'Next payment', 'Prochain versement')} value={list[0] ? jourMois(list[0].date, lang) : '—'} sub={list[0] ? payLabel(list[0].key, lang) : tr(lang, 'No 2026 date left', 'Plus de date en 2026')} />
      <Rows rows={list.slice(1, 8).map((x) => [payLabel(x.key, lang), jourMois(x.date, lang)] as [string, string])} />
    </>} />
  );
}
