/**
 * Prestations provinciales et territoriales, juillet 2026 à juin 2027 (année de base 2025).
 * Seules les règles publiées sont calculées : quand une province ne publie pas son taux de
 * réduction (POE de l'Ontario, Allocation famille du Québec, ACFB de l'Alberta, crédit de la
 * Saskatchewan), la fonction renvoie le maximum et le seuil, et `partial: true` au-delà du seuil.
 */
import { P } from './params';
const pos = (x: number) => Math.max(0, x);
const r2 = (x: number) => Math.round(x * 100) / 100;
const O = P.prov.on;

export type Province = 'on' | 'qc' | 'bc' | 'ab' | 'sk' | 'mb' | 'nb' | 'ns' | 'pe' | 'nl' | 'yt' | 'nt' | 'nu';
export const PROVINCES: Province[] = ['on', 'qc', 'bc', 'ab', 'sk', 'mb', 'nb', 'ns', 'pe', 'nl', 'yt', 'nt', 'nu'];

export interface OtbIn { couple: boolean; children: number; afni: number; senior?: boolean; rent?: number; propertyTax?: number; reserve?: boolean; north?: boolean }
export interface OtbOut { oeptc: number; ostc: number; noec: number; annual: number; monthly: number; lumpSum: boolean }
/** Prestation Trillium de l'Ontario : CIEFO (énergie et impôts fonciers), CTVO (taxe de vente) et CENO (Nord). */
export function trillium({ couple, children, afni, senior = false, rent = 0, propertyTax = 0, reserve = false, north = false }: OtbIn): OtbOut {
  const E = O.oeptc;
  const family = couple || children > 0 || senior;
  // Coût d'habitation : impôts fonciers + 20 % du loyer payé en 2025 (feuille de calcul de l'ARC).
  const occupancy = propertyTax + E.rent_share * rent;
  let oeptc = 0;
  if (reserve) oeptc = Math.min(E.max_reserve, occupancy);
  else if (occupancy > 0) {
    const [cap, add] = senior ? E.prop_65 : E.prop_18_64;
    const energy = Math.min(E.energy_max, occupancy);
    const property = Math.min(occupancy, add + Math.min(cap, 0.1 * occupancy));
    oeptc = Math.min(senior ? E.max_65 : E.max_18_64, energy + property);
  }
  oeptc = pos(oeptc - E.rate * pos(afni - (family ? E.thr_family : E.thr_single)));
  const S = O.ostc;
  const people = 1 + (couple ? 1 : 0) + children;
  const ostc = pos(S.per_person * people - S.rate * pos(afni - (couple || children > 0 ? S.thr_family : S.thr_single)));
  const N = O.noec;
  const noec = north ? pos((couple || children > 0 ? N.max_family : N.max_single) - N.rate * pos(afni - (couple || children > 0 ? N.thr_family : N.thr_single))) : 0;
  const annual = r2(oeptc + ostc + noec);
  return { oeptc: r2(oeptc), ostc: r2(ostc), noec: r2(noec), annual, monthly: r2(annual / 12), lumpSum: annual > 0 && annual <= O.otb.lump_max };
}

/** Prestation ontarienne pour enfants : maximum sous le seuil ; taux de réduction non publié au-delà. */
export function ontarioChildBenefit(children: number, afni: number) {
  const c = O.ocb;
  return { max: children * c.max_year, monthlyMax: r2(children * c.max_month), partial: children > 0 && afni > c.threshold, threshold: c.threshold };
}

/** Allocation famille du Québec 2026 : maximum sous le seuil ; au-delà, entre le maximum et le minimum (taux non publié). */
export function quebecFamilyAllowance(children: number, singleParent: boolean, familyIncome: number) {
  const A = P.prov.qc.af;
  const thr = singleParent ? A.thr_single : A.thr_couple;
  const max = children * A.max + (singleParent && children > 0 ? A.single_max : 0);
  const min = children * A.min + (singleParent && children > 0 ? A.single_min : 0);
  const school = children * A.school;
  return { max, min, school, threshold: thr, partial: children > 0 && familyIncome > thr };
}

/** Allocation familiale de la Colombie-Britannique : deux tranches réduites de 4 %, avec un minimum garanti entre elles. */
export function bcFamilyBenefit(children: number, afni: number, singleParent = false) {
  const B = P.prov.bc.bcfb;
  const pick = (arr: number[]) => Array.from({ length: children }, (_, i) => arr[Math.min(i, 2)]).reduce((s, x) => s + x, 0);
  const max = pick(B.max), min = pick(B.min);
  const supp = singleParent && children > 0 ? B.single_supp : 0;
  const top = max + supp;
  // Première réduction jusqu'au minimum garanti (+ supplément monoparental, qui suit le même calcul), seconde au-delà du second seuil.
  let amount = pos(top - B.rate * pos(afni - B.thr1));
  amount = Math.max(amount, Math.min(top, min + supp));
  if (afni > B.thr2) amount = pos(Math.min(amount, min + supp) - B.rate * (afni - B.thr2));
  return { max: top, min: min + supp, annual: r2(children ? amount : 0), monthly: r2(children ? amount / 12 : 0) };
}

/** Allocation pour enfants et familles de l'Alberta : composantes de base et travail (taux de réduction non publiés). */
export function albertaChildFamilyBenefit(children: number, afni: number, workingIncome: number) {
  const A = P.prov.ab.acfb;
  if (!children) return { base: 0, work: 0, basePartial: false, workPartial: false };
  const i = Math.min(children, 4) - 1;
  const work = Math.min(A.work[i], A.work_phase_in * pos(workingIncome - A.work_start));
  return { base: A.base[i], work: r2(work), basePartial: afni > A.base_thr, workPartial: afni > A.work_thr };
}

/** Crédit pour la TVH du Nouveau-Brunswick : 300 $ par adulte, 100 $ par enfant, réduit de 2 % au-delà de 35 000 $. */
export function nbHstCredit(couple: boolean, children: number, afni: number) {
  const H = P.prov.nb.hstc;
  const gross = H.adult + (couple ? H.spouse + children * H.child : children > 0 ? H.first_child_single + (children - 1) * H.child : 0);
  return r2(pos(gross - H.rate * pos(afni - H.thr)));
}
/** Crédit d'impôt pour la vie abordable de la Nouvelle-Écosse : 255 $ plus 60 $ par enfant, réduit de 5 % au-delà de 30 000 $. */
export function nsAffordableLiving(children: number, afni: number) {
  const A = P.prov.ns.altc;
  return r2(pos(A.base + children * A.child - A.rate * pos(afni - A.thr)));
}
/** Programmes à montant fixe ou sans taux publié : maximum annuel et seuil, pour le tableau par province. */
export function provinceChildMax(p: Province, children: number, under6 = 0): { annualMax: number; threshold: number | null } {
  const pr = P.prov;
  switch (p) {
    case 'on': return { annualMax: children * pr.on.ocb.max_year, threshold: pr.on.ocb.threshold };
    case 'qc': return { annualMax: children * pr.qc.af.max, threshold: pr.qc.af.thr_couple };
    case 'bc': return { annualMax: bcFamilyBenefit(children, 0).max, threshold: pr.bc.bcfb.thr1 };
    case 'ab': return { annualMax: children ? pr.ab.acfb.base[Math.min(children, 4) - 1] + pr.ab.acfb.work[Math.min(children, 4) - 1] : 0, threshold: pr.ab.acfb.base_thr };
    case 'nb': return { annualMax: r2(children * pr.nb.nbctb_month * 12), threshold: pr.nb.nbctb_thr };
    case 'ns': return { annualMax: r2(children * pr.ns.nscb_month * 12), threshold: pr.ns.nscb_partial[0] };
    case 'pe': return { annualMax: r2(children * pr.pe.child_month.under45000 * 12), threshold: 45000 };
    case 'nl': return { annualMax: r2(children ? pr.nl.child_month.slice(0, Math.min(children, 4)).reduce((s, x) => s + x, 0) * 12 + pos(children - 4) * pr.nl.child_month[3] * 12 : 0), threshold: pr.nl.child_thr };
    case 'yt': return { annualMax: r2(children * pr.yt.child_month * 12), threshold: pr.yt.thr };
    case 'nt': {
      // Montants familiaux publiés par l'ARC (ils n'augmentent pas proportionnellement au nombre d'enfants).
      // Âges mêlés : calcul non publié, on prend la grille la plus généreuse (borne haute).
      const fam = (g: number[], extra: number, n: number) => (n <= 0 ? 0 : n <= 4 ? g[n - 1] : g[3] + (n - 4) * extra);
      const grid = under6 > 0 ? fam(pr.nt.grid_u6, pr.nt.extra_u6, children) : fam(pr.nt.grid_6_17, pr.nt.extra_6_17, children);
      return { annualMax: r2(grid * 12), threshold: pr.nt.thr };
    }
    case 'nu': return { annualMax: r2(children * pr.nu.child_month * 12), threshold: pr.nu.thr };
    default: return { annualMax: 0, threshold: null };
  }
}
