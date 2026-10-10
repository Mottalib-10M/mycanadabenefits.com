import { P } from '../engine';
import { T, eur, type L } from './_kit';
/** Crédit pour solidarité du Québec : montant avant réduction, composante par composante (paramètres de juillet 2026 à juin 2027). */
export default (l: L) => ({
  title: T(l, 'Your solidarity credit before any income reduction', 'Votre crédit pour solidarité avant réduction'),
  cta: T(l, 'Quebec family allowance calculator', 'Calculateur de l’Allocation famille'),
  inputs: [
    { id: 'h', label: T(l, 'Household', 'Ménage'), def: 0, options: [T(l, 'Living alone', 'Personne vivant seule'), T(l, 'Single parent', 'Famille monoparentale'), T(l, 'Couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'k', label: T(l, 'Dependent children', 'Enfants à charge'), def: 0, max: 10 },
    { id: 'v', label: T(l, 'Living in a northern village', 'Vous habitez un village nordique'), def: 0, options: [T(l, 'No', 'Non'), T(l, 'Yes', 'Oui')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ h, k, v }: Record<string, number>) => {
    const S = P.prov.qc.solidarity;
    const couple = h === 2, alone = h === 0;
    const kids = alone ? 0 : (k || 0);
    const qst = S.qst_base + (couple ? S.qst_spouse : 0) + (alone ? S.qst_alone : 0);
    const housing = (couple ? S.housing_couple : S.housing_single) + kids * S.housing_child;
    const north = v === 1 ? (couple ? 2 : 1) * S.northern_adult + kids * S.northern_child : 0;
    const total = qst + housing + north;
    return {
      head: [T(l, 'Maximum for July 2026 to June 2027', 'Maximum de juillet 2026 à juin 2027'), eur(total, l)] as [string, string],
      rows: [
        [T(l, 'QST component', 'Composante TVQ'), eur(qst, l)],
        [T(l, 'Housing component', 'Composante logement'), eur(housing, l)],
        [T(l, 'Northern village component', 'Composante village nordique'), eur(north, l)],
        [T(l, 'Reduced when family income exceeds', 'Réduit au-delà d’un revenu familial de'), eur(S.threshold, l)],
      ] as [string, string][],
      note: T(l, 'Assumes you qualify for the housing component. Above the threshold the credit is reduced at a rate we could not verify on Revenu Québec, so no reduced amount is shown.', 'Suppose que vous avez droit à la composante logement. Au-delà du seuil, le crédit est réduit à un taux que nous n’avons pas pu vérifier chez Revenu Québec : aucun montant réduit n’est affiché.'),
    };
  },
});
