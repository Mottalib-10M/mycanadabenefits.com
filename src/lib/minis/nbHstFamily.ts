import { nbHstCredit } from '../engine/provinces';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Nouveau-Brunswick : crédit pour la TVH calculé exactement (moteur), avec la prestation fiscale pour enfants et le supplément scolaire. */
export default (l: L) => ({
  title: T(l, 'New Brunswick HST credit and child benefit', 'Crédit pour la TVH et prestation pour enfants du N.-B.'),
  cta: T(l, 'Federal GST credit calculator', 'Calcul du crédit fédéral pour la TPS'),
  inputs: [
    { id: 'c', label: T(l, 'Spouse or partner', 'Conjoint ou conjointe'), def: 1, options: [T(l, 'No', 'Non'), T(l, 'Yes', 'Oui')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Children under 19', 'Enfants de moins de 19 ans'), def: 2, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 19000, unit: '$', max: 500000 },
  ],
  run: ({ c, n, i }: Record<string, number>) => {
    const B = P.prov.nb; const X = P.x.hNbSchool;
    const hst = nbHstCredit(c === 1, n, i);
    const ctb = n * B.nbctb_month;
    return { head: [T(l, 'HST credit per year', 'Crédit pour la TVH par an'), eur(hst, l, 2)] as [string, string],
      rows: [[T(l, 'Each quarterly share', 'Chaque versement trimestriel'), eur(hst / 4, l, 2)], [T(l, 'Child tax benefit, monthly', 'Prestation fiscale pour enfants, par mois'), n === 0 ? eur(0, l) : i <= B.nbctb_thr ? eur(ctb, l, 2) : T(l, `Partial, below ${eur(ctb, l, 2)}`, `Partielle, sous ${eur(ctb, l, 2)}`)], [T(l, 'School supplement, July 2026', 'Supplément scolaire, juillet 2026'), i <= X.thr && n > 0 ? T(l, `${eur(X.amount * n, l)} if born 2009 to 2021`, `${eur(X.amount * n, l)} si nés de 2009 à 2021`) : eur(0, l)]] as [string, string][],
      note: T(l, 'HST credit: exact CRA formula (2% reduction). Child tax benefit reduction rate not published above the threshold.', 'Crédit pour la TVH : formule exacte de l’ARC (réduction de 2 %). Taux de réduction de la prestation pour enfants non publié au-delà du seuil.') };
  },
});
