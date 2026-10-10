import { P, cppPension } from '../engine';
import { T, eur, pct, type L } from './_kit';
/** RRQ : rente de retraite selon l'âge de début (60 à 72 ans), comparée au RPC au même âge. */
export default (l: L) => {
  const X = P.x;
  const ages = Array.from({ length: X.gQppMaxAge - X.gQppMinAge + 1 }, (_, i) => X.gQppMinAge + i);
  return {
    title: T(l, 'Your QPP pension at the age you start it', 'Votre rente du RRQ selon l’âge de début'),
    cta: T(l, 'CPP calculator for the rest of Canada', 'Calculateur du RPC (hors Québec)'),
    inputs: [
      { id: 'p', label: T(l, 'Pension at 65 on your statement', 'Rente à 65 ans sur votre relevé'), def: X.gQppAvg['65'], unit: '$', max: 2000 },
      { id: 'a', label: T(l, 'Age you start', 'Âge de début'), def: 62, options: ages.map((a) => ({ value: String(a), label: T(l, `${a}`, `${a} ans`) })) },
    ],
    run: ({ p, a }: Record<string, number>) => {
      const base = Math.min(p || 0, P.prov.qc.qpp.max_65);
      const age = Math.min(X.gQppMaxAge, Math.max(X.gQppMinAge, a || 65));
      const m = Math.round((age - 65) * 12);
      const atMax = base >= P.prov.qc.qpp.max_65;
      const late = base * (1 + X.gQppLate * Math.max(0, m));
      const low = base * (1 + X.gQppEarlyHigh * Math.min(0, m));
      const high = atMax ? low : base * (1 + X.gQppEarlyLow * Math.min(0, m));
      const value = m >= 0 ? eur(late, l, 2) : low === high ? eur(low, l, 2) : `${eur(low, l)} – ${eur(high, l)}`;
      const change = m >= 0 ? `+${pct(X.gQppLate * m, l, 1)}` : atMax ? `−${pct(-X.gQppEarlyHigh * m, l, 1)}` : `−${pct(-X.gQppEarlyLow * m, l, 1)} ${T(l, 'to', 'à')} −${pct(-X.gQppEarlyHigh * m, l, 1)}`;
      const cpp = age <= P.cpp.max_age ? eur(cppPension(base, age).monthly, l, 2) : T(l, 'not possible after 70', 'impossible après 70 ans');
      return {
        head: [T(l, `QPP pension per month, starting at ${age}`, `Rente du RRQ par mois, début à ${age} ans`), value] as [string, string],
        rows: [
          [T(l, 'Change compared with 65', 'Écart par rapport à 65 ans'), change],
          [T(l, 'Same entitlement under the CPP', 'Même droit au RPC'), cpp],
        ] as [string, string][],
        note: m < 0 && !atMax
          ? T(l, `Before 65 Retraite Québec cuts ${pct(X.gQppEarlyLow, l, 1)} to ${pct(X.gQppEarlyHigh, l, 1)} a month, closer to the higher rate as the pension nears the maximum: the range covers both ends.`, `Avant 65 ans, Retraite Québec retire de ${pct(X.gQppEarlyLow, l, 1)} à ${pct(X.gQppEarlyHigh, l, 1)} par mois, plus près du taux le plus haut à mesure que la rente approche du maximum : la fourchette couvre les deux bornes.`)
          : T(l, '2026 dollars, before indexation and income tax.', 'Dollars de 2026, avant indexation et impôt.'),
      };
    },
  };
};
