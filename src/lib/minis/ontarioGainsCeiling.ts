import { gis, oas } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** RRAG de l'Ontario : plafond par aîné selon le revenu privé, à côté de la SV et du SRG fédéraux. */
export default (l: L) => ({
  title: T(l, 'GAINS next to your OAS and GIS', 'Le RRAG à côté de votre SV et de votre SRG'),
  cta: T(l, 'GIS calculator', 'Calculateur du SRG'),
  inputs: [
    { id: 'k', label: T(l, 'Household', 'Ménage'), def: 0, options: [T(l, 'Single senior', 'Personne âgée seule'), T(l, 'Couple, both 65+ on OAS', 'Couple, tous deux 65 ans et plus à la SV')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'i', label: T(l, 'Yearly private income (couple: combined)', 'Revenu privé annuel (couple : combiné)'), def: 3000, unit: '$', max: 50000 },
  ],
  run: ({ k, i }: Record<string, number>) => {
    const G = P.prov.on.gains, couple = k === 1;
    const limit = couple ? G.income_max_couple : G.income_max_single;
    const cap = i <= limit ? G.max_month : 0;
    const o = oas({ years: 40, startAge: 65 }).gross, g = gis(couple ? 'spouse_oas' : 'single', i).monthly;
    return { head: [T(l, 'GAINS ceiling per senior', 'Plafond du RRAG par aîné'), cap ? `${T(l, 'up to', 'jusqu’à')} ${eur(cap, l)}` : eur(0, l)] as [string, string],
      rows: [[T(l, 'Private income limit', 'Limite de revenu privé'), eur(limit, l)], [T(l, 'Federal GIS per senior', 'SRG fédéral par aîné'), eur(g, l, 2)], [T(l, 'Full OAS, 65 to 74', 'SV complète, 65 à 74 ans'), eur(o, l, 2)], [T(l, 'Ceiling of the three together', 'Plafond des trois ensemble'), eur(o + g + cap, l, 2)]] as [string, string][],
      note: T(l, 'Ontario publishes the maximum and the income limits, not the reduction formula: the GAINS shown is a ceiling, the Ministry of Finance sets the actual amount.', 'L’Ontario publie le maximum et les limites de revenu, pas la formule de réduction : le RRAG affiché est un plafond, le ministère des Finances fixe le montant réel.') };
  },
});
