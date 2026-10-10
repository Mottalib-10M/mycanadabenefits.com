/** Cas de référence officiels (tableaux de l'ARC et d'EDSC relevés le 2026-10-10). Écart toléré : 1 cent sauf mention. */
import { describe, expect, it } from 'vitest';
import * as M from './index';
import { P } from './params';

describe('ACEBE (ex-crédit TPS/TVH), tableau de versements de l’ARC, juillet 2026 à juin 2027', () => {
  const single = (inc: number) => M.cgeb({ couple: false, children: 0, afni: inc }).annual;
  it('personne seule : lignes du tableau', () => {
    expect(single(10000)).toBeCloseTo(445, 2);
    expect(single(14000)).toBeCloseTo(493.72, 2);
    expect(single(15000)).toBeCloseTo(513.72, 2);
    expect(single(20000)).toBeCloseTo(613.72, 2);
    expect(single(25000)).toBeCloseTo(679, 2);
    expect(single(50000)).toBeCloseTo(500.6, 2);
    expect(single(60000)).toBeCloseTo(0.6, 2);
    expect(single(65000)).toBe(0);
  });
  it('couple sans enfant, parent seul avec un enfant, couple avec deux enfants', () => {
    expect(M.cgeb({ couple: true, children: 0, afni: 40000 }).annual).toBeCloseTo(890, 2);
    expect(M.cgeb({ couple: true, children: 0, afni: 50000 }).annual).toBeCloseTo(711.6, 2);
    expect(M.cgeb({ couple: true, children: 0, afni: 60000 }).annual).toBeCloseTo(211.6, 2);
    expect(M.cgeb({ couple: false, children: 1, afni: 10000 }).annual).toBeCloseTo(1124, 2);
    expect(M.cgeb({ couple: false, children: 1, afni: 50000 }).annual).toBeCloseTo(945.6, 2);
    expect(M.cgeb({ couple: false, children: 1, afni: 60000 }).annual).toBeCloseTo(445.6, 2);
    expect(M.cgeb({ couple: true, children: 2, afni: 40000 }).annual).toBeCloseTo(1358, 2);
    expect(M.cgeb({ couple: true, children: 2, afni: 60000 }).annual).toBeCloseTo(679.6, 2);
    expect(M.cgeb({ couple: true, children: 2, afni: 75000 }).annual).toBe(0);
  });
  it('versement trimestriel = quart du montant annuel', () => {
    expect(M.cgeb({ couple: false, children: 0, afni: 25000 }).quarterly).toBeCloseTo(169.75, 2);
  });
});

describe('ACE juillet 2026 à juin 2027', () => {
  it('maximum sous 38 237 $', () => {
    expect(M.ccb({ under6: 1, age6to17: 0, afni: 30000 }).annual).toBe(8157);
    expect(M.ccb({ under6: 0, age6to17: 1, afni: 38237 }).annual).toBe(6883);
  });
  it('la réduction au second seuil retombe sur les montants fixes publiés (à 1 $ près)', () => {
    for (let n = 1; n <= 4; n++) {
      const r = M.ccb({ under6: n, age6to17: 0, afni: P.ccb.t2 }).reduction;
      expect(Math.abs(r - P.ccb.base2[n - 1])).toBeLessThanOrEqual(1);
    }
  });
  it('au-delà de 82 847 $ : montant fixe + taux', () => {
    const r = M.ccb({ under6: 0, age6to17: 2, afni: 100000 });
    expect(r.reduction).toBeCloseTo(6022 + 0.057 * (100000 - 82847), 2);
  });
  it('prestation pour enfants handicapés : 3 480 $ puis 3,2 % au-delà de 82 847 $', () => {
    expect(M.ccb({ under6: 0, age6to17: 1, afni: 50000, disabled: 1 }).cdb).toBe(3480);
    expect(M.ccb({ under6: 0, age6to17: 1, afni: 92847, disabled: 1 }).cdb).toBeCloseTo(3480 - 320, 2);
  });
  it('versement unique sous 240 $ par an', () => {
    const z = M.ccbZeroIncome(0, 1);
    expect(M.ccb({ under6: 0, age6to17: 1, afni: z - 1000 }).lumpSum).toBe(true);
  });
});

describe('ACT 2026 (tableau d’indexation de l’ARC)', () => {
  it('maximum atteint, puis nul au revenu publié', () => {
    expect(M.cwb({ family: false, working: 15000, afni: 15000 }).basic).toBe(1665);
    expect(M.cwb({ family: false, working: 38492, afni: 38492 }).basic).toBeLessThan(1);
    expect(M.cwb({ family: true, working: 50378, afni: 50378 }).basic).toBeLessThan(1);
  });
  it('démarrage : 27 % au-delà de 3 000 $', () => {
    expect(M.cwb({ family: false, working: 5000, afni: 5000 }).basic).toBeCloseTo(540, 2);
  });
  it('exemption du deuxième revenu plafonnée à 16 714 $', () => {
    const r = M.cwb({ family: true, working: 30000, spouseWorking: 20000, afni: 50000 });
    expect(r.adjustedIncome).toBe(50000 - 16714);
  });
  it('supplément pour invalidité plafonné à 860 $', () => {
    expect(M.cwb({ family: false, working: 10000, afni: 10000, disability: true }).disability).toBe(860);
  });
});

describe('Prestation canadienne pour personnes handicapées 2026-27', () => {
  it('maximum annuel et réduction de 20 %', () => {
    expect(M.canadaDisabilityBenefit({ couple: false, afni: 20000, working: 0, age: 40, dtc: true }).annual).toBeCloseTo(2450.4, 2);
    expect(M.canadaDisabilityBenefit({ couple: false, afni: 28000, working: 0, age: 40, dtc: true }).annual).toBeCloseTo(1450.4, 2);
    expect(M.canadaDisabilityBenefit({ couple: false, afni: 28000, working: 5000, age: 40, dtc: true }).annual).toBeCloseTo(2450.4, 2);
    expect(M.canadaDisabilityBenefit({ couple: false, afni: 10000, working: 0, age: 66, dtc: true }).eligible).toBe(false);
  });
});

describe('RPC 2026', () => {
  it('ajustements à 60 et 70 ans', () => {
    expect(M.cppPension(P.cpp.max_65, 60).monthly).toBeCloseTo(1507.65 * 0.64, 2);
    expect(M.cppPension(P.cpp.max_65, 70).monthly).toBeCloseTo(1507.65 * 1.42, 2);
  });
  it('cotisations maximales publiées par l’ARC', () => {
    const c = M.cppContribution(200000);
    expect(c.base).toBeCloseTo(4230.45, 2);
    expect(c.second).toBeCloseTo(416, 2);
    expect(c.total).toBeCloseTo(4646.45, 2);
  });
});

describe('SV, SRG et Allocation, octobre à décembre 2026', () => {
  it('pension reportée à 70 ans : 1 037,00 $ (exemple de Service Canada)', () => {
    expect(M.oas({ years: 40, startAge: 70 }).gross).toBeCloseTo(1037.0, 2);
  });
  it('pension partielle et hausse à 75 ans', () => {
    expect(M.oas({ years: 20, startAge: 65 }).gross).toBeCloseTo(381.25, 2);
    expect(M.oas({ years: 40, startAge: 65, age75: true }).gross).toBeCloseTo(838.75, 2);
    expect(M.oas({ years: 9, startAge: 65 }).eligible).toBe(false);
  });
  it('impôt de récupération : 15 % au-delà de 93 454 $, pension nulle au seuil publié', () => {
    expect(M.oasRecovery(103454, 9150)).toBeCloseTo(1500, 2);
    // Le seuil publié (152 062 $) est calculé par Service Canada sur une pension annuelle de référence : avec le montant d'octobre à décembre 2026, il reste une trentaine de dollars.
    expect(M.oas({ years: 40, startAge: 65, netIncome: 152062 }).net).toBeLessThan(35);
    expect(M.oas({ years: 40, startAge: 65, netIncome: 160000 }).net).toBe(0);
  });
  it('SRG : maximum à revenu nul, nul au seuil, complément éteint au seuil publié', () => {
    for (const k of ['single', 'spouse_oas', 'spouse_allowance', 'spouse_no_oas'] as const) {
      const g = P.gis[k];
      expect(M.gis(k, 0).monthly).toBeCloseTo(g.max, 2);
      expect(M.gis(k, g.thr).monthly).toBe(0);
      expect(M.gis(k, g.thr - 24).monthly).toBeLessThan(3);
      expect(M.gis(k, g.topup_thr).topup).toBeLessThan(0.01);
    }
  });
  it('Allocation et Allocation au survivant : maximum à revenu nul, nulles au seuil', () => {
    expect(M.allowance(false, 0).monthly).toBeCloseTo(1448.06, 2);
    expect(M.allowance(true, 0).monthly).toBeCloseTo(1726.18, 2);
    expect(M.allowance(false, 42768).monthly).toBe(0);
    expect(M.allowance(true, 31152).monthly).toBe(0);
    expect(M.allowance(false, 42768 - 48).monthly).toBeLessThan(3);
  });
  it('exemption de revenu d’emploi : 5 000 $ + moitié jusqu’à 15 000 $', () => {
    expect(M.gisWorkExemption(4000)).toBe(4000);
    expect(M.gisWorkExemption(20000)).toBe(10000);
  });
});

describe('FERR', () => {
  it('facteurs de l’article 7308', () => {
    expect(M.rrifMinimum(100000, 71).minimum).toBeCloseTo(5280, 2);
    expect(M.rrifMinimum(100000, 65).minimum).toBeCloseTo(4000, 2);
    expect(M.rrifMinimum(100000, 99).factor).toBe(0.2);
  });
});

describe('Provinces', () => {
  it('Trillium : CTVO de 378 $ par personne réduit de 4 %', () => {
    expect(M.trillium({ couple: false, children: 0, afni: 20000 }).ostc).toBe(378);
    expect(M.trillium({ couple: true, children: 2, afni: 40000 }).ostc).toBeCloseTo(4 * 378 - 0.04 * (40000 - 36309), 2);
  });
  it('Trillium : CIEFO plafonné (18-64 ans : 1 307 $ ; 65 ans et plus : 1 488 $)', () => {
    expect(M.trillium({ couple: false, children: 0, afni: 10000, propertyTax: 10000 }).oeptc).toBe(1307);
    expect(M.trillium({ couple: false, children: 0, afni: 10000, propertyTax: 8000, senior: true }).oeptc).toBe(1488);
  });
  it('Allocation familiale de la C.-B. : maximum, minimum garanti, extinction', () => {
    expect(M.bcFamilyBenefit(2, 20000).annual).toBe(2850);
    expect(M.bcFamilyBenefit(2, 80000).annual).toBe(1525);
    expect(M.bcFamilyBenefit(1, 200000).annual).toBe(0);
  });
  it('crédit pour la TVH du N.-B. et crédit pour la vie abordable de la N.-É.', () => {
    expect(M.nbHstCredit(true, 2, 30000)).toBe(800);
    expect(M.nsAffordableLiving(2, 30000)).toBe(375);
  });
});

describe('Calendrier 2026', () => {
  it('douze dates RPC/SV et ACE, ACEBE en juillet et octobre', () => {
    expect(M.payDates('cpp_oas')).toHaveLength(12);
    expect(M.payDates('ccb')).toHaveLength(12);
    expect(M.payDateIn('cgeb', 7)).toBe('2026-07-03');
    expect(M.payDateIn('cgeb', 10)).toBe('2026-10-05');
    expect(M.upcoming('2026-10-10')[0].date >= '2026-10-10').toBe(true);
  });
});

describe('Territoires du Nord-Ouest', () => {
  it('montants familiaux de l’ARC, pas un multiple du montant pour un enfant', () => {
    expect(M.provinceChildMax('nt', 2, 2).annualMax).toBeCloseTo(122.25 * 12, 2);
    expect(M.provinceChildMax('nt', 5, 0).annualMax).toBeCloseTo((163 + 24.41) * 12, 2);
  });
});
