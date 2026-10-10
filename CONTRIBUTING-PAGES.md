# Ajouter ou écrire une page de My Canada Benefits (ca-prestations)

Notice pour les agents qui écrivent des pages. À lire en entier avant d'écrire une ligne, avec
`~/Documents/GitHub/RECETTE-SITE.md` §6 (unicité), §7 (FAQ), §9 (écriture), §9.3 (mini-simulateurs), §11 (titres),
§21 (bloc citable), §26 (texte replié). Nom provisoire du site : **My Canada Benefits** (domaine non choisi, URL
provisoire `https://mycanadabenefits.com`).

Site : prestations et pensions fédérales et provinciales du Canada, montants 2026, **en anglais (`/en/`, langue
par défaut) et en français (`/fr/`)**. Éditeur : Radif Partners (jamais de nom de personne). Aucun lien vers un
autre site que les sources officielles. Jamais « taxineo », jamais un site du portefeuille
(`~/Documents/GitHub/_trame/domaines-ovh.txt` : usfamilycalc.com, calculaides.fr, myeicanada.com,
canadanetpay.com, statutorypay.co.uk…). **Hors sujet** : assurance-emploi, REER/CELI/CELIAPP, impôt sur le revenu
(autres sites).

## Principe : une page = un fichier

- Un guide = `src/content/guides/<id>.ts`. Une page outil = `src/content/outils/<id>.ts` (champ `tool`, calculateur
  complet déjà écrit dans `src/components/calc/Tools.tsx`).
- Le fichier porte tout, dans les deux langues. Le cœur (routes, menus, sitemap, hreflang, schémas) le lit seul.
  **Ne modifiez aucun fichier du cœur** (components, layouts, i18n, lib/engine, lib/helpers, params-2026.json).
- Les pages du plan existent déjà en **ébauche** (titre vide) : vous **remplacez** l'ébauche par la page complète,
  en gardant `id`, `group`, `tool` et les deux `slug` indiqués dans le plan.
- Un mini-simulateur = `src/lib/minis/<kind>.ts`, chargé automatiquement ; **un par guide, propre à son sujet**
  (un sujet, un calcul). Il appelle le moteur (`src/lib/engine/`), jamais un calcul refait à côté.
- **Modèle à copier pour la structure (jamais pour les phrases)** : `src/content/guides/cpp-payment-dates.ts` et
  `src/lib/minis/cppDateDeposit.ts`.

## ATTENTION : l'ordre des langues est anglais puis français

- `T(l, 'texte anglais', 'texte français')` dans les minis (c'est l'inverse de calculaides.fr).
- `en:` vient avant `fr:` dans les fichiers de page.

## Le moteur (`src/lib/engine/`, exposé dans les textes par `h.M`, paramètres par `h.P`)

| Fonction | Rôle |
|---|---|
| `ccb({ under6, age6to17, afni, disabled? })` | ACE + PEH : `max`, `reduction`, `base`, `cdb`, `annual`, `monthly`, `lumpSum`, `band` |
| `ccbZeroIncome(under6, age6to17)` | revenu où l'ACE tombe à zéro |
| `cgeb({ couple, children, afni, ownNetIncome? })` | ACEBE (ex-crédit TPS/TVH) : `base`, `supplement`, `reduction`, `annual`, `quarterly` |
| `cwb({ family, working, afni, spouseWorking?, disability?, spouseDisability? })` | ACT 2026 : `basic`, `disability`, `total`, `adjustedIncome`, `advanceMax` |
| `canadaDisabilityBenefit({ couple, bothEligible?, afni, working, age, dtc })` | PCPSH : `eligible`, `countedIncome`, `annual`, `monthly` |
| `dental(afni)` | RCSD : `eligible`, `copay` (0, 0,4 ou 0,6) |
| `cppFactor(age)`, `cppPension(at65, startAge)`, `cppCumulative(at65, start, toAge)`, `cppBreakEven(at65, b, a)`, `cppContribution(earnings, selfEmployed?)` | RPC |
| `oas({ years, startAge, age75?, netIncome?, incomeYear? })` | SV : `eligible`, `fraction`, `gross`, `recovery`, `net`, `annualNet`, `deferral` |
| `oasRecovery(netIncome, annualOas, incomeYear?)` | impôt de récupération annuel |
| `gis(kind, income)` (`'single' \| 'spouse_oas' \| 'spouse_allowance' \| 'spouse_no_oas'`), `gisWorkExemption(emp)` | SRG mensuel : `monthly`, `basic`, `topup` |
| `allowance(survivor, income)` | Allocation / Allocation au survivant : `monthly` |
| `rrifMinimum(value, ageJan1)` | FERR : `factor`, `minimum` |
| `trillium({ couple, children, afni, senior?, rent?, propertyTax?, reserve?, north? })` | Trillium : `oeptc`, `ostc`, `noec`, `annual`, `monthly`, `lumpSum` |
| `ontarioChildBenefit(n, afni)`, `quebecFamilyAllowance(n, singleParent, income)`, `albertaChildFamilyBenefit(n, afni, work)` | maximum, seuil, `partial` (taux non publié) |
| `bcFamilyBenefit(n, afni, singleParent?)`, `nbHstCredit(couple, n, afni)`, `nsAffordableLiving(n, afni)`, `provinceChildMax(p, n, under6?)` | provinces |
| `payDates(key)`, `payDateIn(key, month)`, `upcoming(fromIso, keys?)` (`'cpp_oas' \| 'ccb' \| 'cgeb' \| 'acwb' \| 'otb' \| 'acfb' \| 'cdb' \| 'nldb'`) | calendrier 2026 |

Tous les paramètres sont dans `src/data/params-2026.json` (lisez-le **en entier** : chaque bloc, chaque source et
sa date). Les faits bruts, avec citation verbatim, URL et date de modification, sont dans
`~/Documents/GitHub/reports/ca-prestations-faits/` : `pensions-federales.json`, `famille-invalidite-travail.json`,
`provinces.json` (lisez aussi leur liste `incertain`). Une valeur ne s'écrit **jamais en dur** dans `resume`,
`faqs` ou `body` : `${h.eur(h.P.ccb.max_under6)}`, pas « 8 157 $ ». Seuls `title` et `description` sont des chaînes
fixes : tout nombre qui y figure doit apparaître aussi dans le texte rendu de la page.

## La règle de vérité (non négociable)

- **Un montant, un seuil, une date, une règle non vérifiés ne se publient pas.** Vous écrivez ce que disent
  `params-2026.json` et les fichiers de faits. Pour un fait absent, lisez la page officielle avec **WebFetch**
  (canada.ca, laws-lois.justice.gc.ca, Retraite Québec, sites provinciaux ; curl est bloqué par canada.ca, WebSearch
  est épuisé, DuckDuckGo est en CAPTCHA : ne contournez rien), demandez une citation verbatim, puis ajoutez le fait
  dans **votre** fichier `src/data/extra/<lot>.json` (voir plus bas). Sinon, n'écrivez pas le fait.
- **Points déjà connus comme NON publiés** (ne pas inventer de taux) : taux de réduction de la Prestation
  ontarienne pour enfants, de l'Allocation famille du Québec, de l'ACFB de l'Alberta, du crédit de la Saskatchewan,
  du NL Income Supplement, des prestations pour enfants du N.-B., de l'Î.-P.-É. et des territoires ; taux de
  réduction du crédit pour solidarité du Québec ; paramètres de l'ACT au Québec, en Alberta et au Nunavut ; dates
  2027 ; montant du complément unique du 5 juin 2026 (non relevé : lisez la page `gst-hst-credit/one-time-top-up.html`
  si vous en avez besoin).
- **Faits déjà établis et piégeux** :
  - le crédit pour la TPS/TVH s'appelle depuis juillet 2026 **Canada Groceries and Essentials Benefit (CGEB) /
    Allocation canadienne pour l'épicerie et les besoins essentiels (ACEBE)**, +25 % pour cinq ans (2026 à 2031),
    mêmes conditions ; versements 2026 : 5 janvier et 2 avril (crédit TPS), 3 juillet et 5 octobre (ACEBE) ;
    complément unique versé le 5 juin 2026 ;
  - la remise canadienne sur le carbone s'est arrêtée le 15 mars 2025, dernier versement en avril 2025 ; le crédit
    d'action climatique de la C.-B. est terminé (dernier versement avril 2025) ;
  - Trillium : versement unique si le droit annuel est de **500 $** ou moins (et non 360 $) ;
  - le seuil de la PCPSH (23 000 / 32 500 $) n'est pas indexé, l'exemption de travail l'est (10 210 / 14 294 $) ;
  - le SRG est un **modèle calé** sur la grille trimestrielle (exact au maximum et aux seuils publiés, à environ
    1 $ par mois près entre les deux) : dites-le quand vous donnez un montant intermédiaire ;
  - l'impôt de récupération de la SV : seuil 93 454 $ (revenu 2025, juillet 2026 à juin 2027), 95 323 $ (revenu
    2026) ; les seuils d'annulation 2026 (155 320 / 161 320 $) sont des **estimations** de Service Canada ;
  - délai avant de signaler un paiement manquant (ARC) : 5 jours ouvrables pour l'ACE et l'ACFB, 10 pour les autres ;
  - SV : lettre d'inscription automatique vers 64 ans quand Service Canada a l'information ;
  - RPC : demande jusqu'à 12 mois avant le début ; décision en 28 jours en ligne, 120 jours sur papier.
- **Pas de conseil personnalisé, pas de promesse.** Chaque page rappelle sobrement que le montant versé est celui de
  l'avis de l'ARC ou de Service Canada.

## Faits supplémentaires : `src/data/extra/<lot>.json`

Un fichier par lot de rédaction (`extra/lot-a.json`, `extra/lot-b.json`…), jamais `params-2026.json` :

```json
{ "sources": { "maCle": { "url": "https://www.canada.ca/en/…", "url_fr": "https://www.canada.ca/fr/…",
    "label": { "en": "CRA, exact page title (modified 2026-xx-xx)", "fr": "ARC, titre exact (modifiée le 2026-xx-xx)" },
    "date_modified": "2026-xx-xx" } },
  "x": { "maValeur": 1234 } }
```

Ces clés sont fusionnées dans `h.P.sources` et `h.P.x` (`${h.eur(h.P.x.maValeur)}`). Préfixez vos clés par votre lot
(`aTopup`, `bNewcomer`…) pour éviter les collisions. L'URL française doit être celle du lien « Français » de la page
anglaise (demandez-la à WebFetch), jamais devinée.

## Les champs d'une page (`src/lib/guide-types.ts`)

| Champ | Règle |
|---|---|
| `id` | = nom du fichier. Liens : `h.a('cpp-calculator', 'texte')`. N'utilisez que des id du plan. |
| `group` | celui du plan. |
| `order` | place dans le groupe, par pas de 10 (outil : 10). |
| `mini` | nom d'un fichier de `src/lib/minis/` (obligatoire pour un guide, absent pour un outil). |
| `miniHref` | facultatif : page cible du bouton du mini (sinon l'outil du groupe). |
| `related` | 3 à 6 id du plan. |
| `sources` | 2 clés de `sources` au moins (params ou extra). |

| Champ texte (`en`, `fr`) | Règle |
|---|---|
| `slug` | **celui du plan, inchangé.** |
| `nav`, `card` | libellé court (menus) ; une phrase (cartes « pages liées »). |
| `title` | **50 à 60 caractères**, « 2026 » dedans, terme-clé en tête (la requête : « CPP Payment Dates 2026 », « Pension de vieillesse 2026 »…). Jamais en tête : « Canada », « Canadian », « Ontario’s »…, un mot d'outil (Calculator, Calculateur, Simulateur, Calcul), une question, « FAQ », « About ». Pas de tiret cadratin. Titres uniques sur tout le site. Comptez avec `python3 -c "print(len('…'))"`. |
| `description` | **150 à 160 caractères**, « 2026 » dedans, un fait chiffré. Unique. |
| `h1` | sans année. |
| `intro` | une phrase. |
| `resume` | `(h) => string` : **UN** paragraphe d'au moins **130 mots**, texte brut, le chiffre d'abord : la réponse à la requête (§21). Le chapeau replié coupe après la 1re phrase : ne commencez pas la 2e phrase par un chiffre. |
| `faqs` | `(h) => FAQ[]` : guide 4 à 8, outil 3 à 5 vraies questions (comme on les tape), réponses de **40 à 90 mots** avec chiffre, condition, source. Une question n'existe **qu'une fois sur tout le site** : posez des questions très propres à votre page. |
| `body` | `(h) => string` HTML (`h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`). Total page (resume + FAQ + body) : **guide ≥ 1 300 mots par langue** (check-seo exige 1 200 sur la page servie), **outil 500 à 800 mots**. `<!--mini:<kind>-->` insère un mini-simulateur de plus. |

Outils `h` : `h.a(id, texte)`, `h.eur(n, décimales?)` (« $1,234 » / « 1 234 $ »), `h.num(n, d?)`, `h.pct(fraction, d?)`,
`h.date(iso)`, `h.table(entêtes, lignes, légende, align)`, `h.src(clé, texte)` (lien vers la source officielle, URL
française sur la page française), `h.P`, `h.M`.

**Page outil** : 3 à 5 FAQ, `body` qui dit ce que l'outil calcule, sur quelles données (montants et date), ce qu'il
ne sait pas faire, avec un tableau de cas types calculé par `h.M`. Le calculateur s'affiche seul (`tool`).

## Mini-simulateur (`src/lib/minis/<kind>.ts`)

`export default (l: L) => ({ title, cta, inputs, run })` — 1 à 3 champs (`options` pour une liste, `moisOptions(l)`
pour un mois), le chiffre du sujet en grand (`head`), 2 à 4 lignes, une `note` facultative. Valeurs par défaut
réalistes. Libellés `T(l, en, fr)`. Nom en camelCase, unique, préfixé par le sujet (`ccbCustody`, `oasDefer`…).
Pas d'année dans un champ numérique (il afficherait « 2,026 ») : utilisez `options`. `_kit.ts` fournit `T`, `eur`,
`pct`, `num`, `moisAnnee`, `jourMois`, `moisOptions`.

## Ton et langue

- **Anglais** (langue par défaut) : pour un résident du Canada, natif ou nouvel arrivant ; termes canadiens (CRA,
  Service Canada, line 23600, notice of assessment, benefit year) ; orthographe canadienne (« cheque », « centre »,
  « labour »).
- **Français** : français du Canada, noms officiels (Agence du revenu du Canada, allocation canadienne pour
  enfants, Sécurité de la vieillesse, Supplément de revenu garanti, Régime de rentes du Québec, « témoins »,
  « courriel », « 1 234 $ »). Accents partout. Pas une traduction de l'anglais : mêmes chiffres, mêmes minis, phrases
  écrites pour le lecteur francophone (Québec, N.-B., Ontario).
- **Interdits** : tiret cadratin « — » ou « &mdash; », « it's important to note », « dive into », « whether you're »,
  « il est important de noter », « plongeons », « que vous soyez X ou Y », « de plus / en outre / par ailleurs » en
  enfilade, triplets systématiques, conclusion-résumé, émojis, listes là où une phrase suffit.
- **Unicité** (§6) : `check-unique` compare toutes les pages d'une langue (seuil 30 %, chiffres neutralisés,
  fenêtre de 12 000 caractères en tête de page). Chaque page parle de **son** cas : son exemple chiffré, son seuil,
  son piège, ses démarches, avec un vocabulaire propre. Ne recopiez aucune phrase d'une autre page (ni du modèle) et
  ne réutilisez pas le même plan de sections.

## Le plan complet (id, groupe, type, URL) — n'écrivez que les vôtres, ne liez qu'à celles-ci

Cœur : `home`, `method`, `about`, `contact`, `editorial`, `widget`, `terms`, `privacy`, `cookies`.

| id | groupe | type | URL anglaise | URL française |
|---|---|---|---|---|
| `benefit-payment-dates` | dates | outil dates | `/en/benefit-payment-dates/` | `/fr/dates-versement-prestations/` |
| `cpp-payment-dates` | dates | guide (fait, modèle) | `/en/cpp-payment-dates/` | `/fr/dates-paiement-rpc/` |
| `oas-payment-dates` | dates | guide | `/en/oas-payment-dates/` | `/fr/dates-paiement-securite-vieillesse/` |
| `gst-payment-dates` | dates | guide | `/en/gst-payment-dates/` | `/fr/dates-versement-credit-tps/` |
| `ccb-payment-dates` | dates | guide | `/en/ccb-payment-dates/` | `/fr/dates-versement-allocation-enfants/` |
| `ccb-calculator` | family | outil ccb | `/en/ccb-calculator/` | `/fr/calcul-allocation-canadienne-enfants/` |
| `canada-child-benefit` | family | guide | `/en/canada-child-benefit/` | `/fr/allocation-canadienne-pour-enfants/` |
| `child-disability-benefit` | family | guide | `/en/child-disability-benefit/` | `/fr/prestation-enfants-handicapes/` |
| `ccb-shared-custody` | family | guide | `/en/ccb-shared-custody/` | `/fr/garde-partagee-allocation-enfants/` |
| `gst-credit-calculator` | credits | outil cgeb | `/en/gst-credit-calculator/` | `/fr/calcul-credit-tps/` |
| `canada-groceries-essentials-benefit` | credits | guide | `/en/canada-groceries-essentials-benefit/` | `/fr/allocation-epicerie-besoins-essentiels/` |
| `canada-workers-benefit` | credits | outil cwb | `/en/canada-workers-benefit/` | `/fr/allocation-canadienne-travailleurs/` |
| `advanced-canada-workers-benefit` | credits | guide | `/en/advanced-canada-workers-benefit/` | `/fr/paiements-anticipes-act/` |
| `cwb-disability-supplement` | credits | guide | `/en/cwb-disability-supplement/` | `/fr/supplement-invalidite-act/` |
| `canada-carbon-rebate` | credits | guide | `/en/canada-carbon-rebate/` | `/fr/remise-canadienne-carbone/` |
| `canada-dental-care-plan` | credits | guide | `/en/canada-dental-care-plan/` | `/fr/regime-canadien-soins-dentaires/` |
| `cpp-calculator` | cpp | outil cpp | `/en/cpp-calculator/` | `/fr/calcul-rpc/` |
| `cpp-payment-amount` | cpp | guide | `/en/cpp-payment-amount/` | `/fr/montant-rpc/` |
| `cpp-at-60-or-70` | cpp | guide | `/en/cpp-at-60-or-70/` | `/fr/rpc-age-de-debut/` |
| `cpp-disability` | cpp | guide | `/en/cpp-disability/` | `/fr/prestation-invalidite-rpc/` |
| `cpp-survivor-pension` | cpp | guide | `/en/cpp-survivor-pension/` | `/fr/pension-survivant-rpc/` |
| `cpp-death-benefit` | cpp | guide | `/en/cpp-death-benefit/` | `/fr/prestation-deces-rpc/` |
| `cpp-contributions` | cpp | guide | `/en/cpp-contributions/` | `/fr/cotisations-rpc/` |
| `quebec-pension-plan` | cpp | guide | `/en/quebec-pension-plan/` | `/fr/regime-rentes-quebec/` |
| `old-age-security` | oas | outil oas | `/en/old-age-security/` | `/fr/pension-de-vieillesse/` |
| `oas-deferral` | oas | guide | `/en/oas-deferral/` | `/fr/report-securite-vieillesse/` |
| `oas-clawback` | oas | outil clawback | `/en/oas-clawback/` | `/fr/recuperation-securite-vieillesse/` |
| `oas-partial-pension` | oas | guide | `/en/oas-partial-pension/` | `/fr/pension-partielle-securite-vieillesse/` |
| `oas-at-75` | oas | guide | `/en/oas-at-75/` | `/fr/hausse-securite-vieillesse-a-75/` |
| `guaranteed-income-supplement` | oas | outil gis | `/en/guaranteed-income-supplement/` | `/fr/supplement-de-revenu-garanti/` |
| `gis-couples` | oas | guide | `/en/gis-couples/` | `/fr/srg-couple/` |
| `gis-work-exemption` | oas | guide | `/en/gis-work-exemption/` | `/fr/srg-revenu-emploi/` |
| `allowance-60-64` | oas | guide | `/en/allowance-60-64/` | `/fr/allocation-conjoint-pensionne/` |
| `allowance-for-the-survivor` | oas | guide | `/en/allowance-for-the-survivor/` | `/fr/allocation-au-survivant/` |
| `rrif-minimum-withdrawal` | oas | outil rrif | `/en/rrif-minimum-withdrawal/` | `/fr/retrait-minimum-ferr/` |
| `rrif-gis-clawback` | oas | guide | `/en/rrif-gis-clawback/` | `/fr/ferr-srg-recuperation/` |
| `canada-disability-benefit` | disability | outil cdb | `/en/canada-disability-benefit/` | `/fr/prestation-canadienne-personnes-handicapees/` |
| `disability-tax-credit` | disability | guide | `/en/disability-tax-credit/` | `/fr/credit-impot-personnes-handicapees/` |
| `odsp-rates` | disability | guide | `/en/odsp-rates/` | `/fr/taux-posph-ontario/` |
| `aish-alberta` | disability | guide | `/en/aish-alberta/` | `/fr/aish-adap-alberta/` |
| `ontario-trillium-benefit` | provinces | outil otb | `/en/ontario-trillium-benefit/` | `/fr/prestation-trillium-ontario/` |
| `ontario-child-benefit` | provinces | guide | `/en/ontario-child-benefit/` | `/fr/prestation-ontarienne-enfants/` |
| `ontario-gains` | provinces | guide | `/en/ontario-gains/` | `/fr/rrag-ontario/` |
| `quebec-family-allowance` | provinces | outil qcfa | `/en/quebec-family-allowance/` | `/fr/allocation-famille-quebec/` |
| `quebec-solidarity-tax-credit` | provinces | guide | `/en/quebec-solidarity-tax-credit/` | `/fr/credit-solidarite-quebec/` |
| `bc-family-benefit` | provinces | outil bcfb | `/en/bc-family-benefit/` | `/fr/allocation-familiale-colombie-britannique/` |
| `bc-climate-action-tax-credit` | provinces | guide | `/en/bc-climate-action-tax-credit/` | `/fr/credit-action-climat-colombie-britannique/` |
| `alberta-child-family-benefit` | provinces | outil acfb | `/en/alberta-child-family-benefit/` | `/fr/allocation-enfants-familles-alberta/` |
| `saskatchewan-low-income-tax-credit` | provinces | guide | `/en/saskatchewan-low-income-tax-credit/` | `/fr/credit-faible-revenu-saskatchewan/` |
| `manitoba-benefits` | provinces | guide | `/en/manitoba-benefits/` | `/fr/prestations-manitoba/` |
| `new-brunswick-benefits` | provinces | guide | `/en/new-brunswick-benefits/` | `/fr/prestations-nouveau-brunswick/` |
| `nova-scotia-benefits` | provinces | guide | `/en/nova-scotia-benefits/` | `/fr/prestations-nouvelle-ecosse/` |
| `pei-benefits` | provinces | guide | `/en/pei-benefits/` | `/fr/prestations-ile-prince-edouard/` |
| `newfoundland-labrador-benefits` | provinces | guide | `/en/newfoundland-labrador-benefits/` | `/fr/prestations-terre-neuve-labrador/` |
| `territories-child-benefits` | provinces | guide | `/en/territories-child-benefits/` | `/fr/prestations-enfants-territoires/` |

## Contrôles (tous à 0 avant de rendre la main)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/ca-prestations
PAGE_FILES=<id1>,<id2> npx vitest run tests/pages.test.ts   # vos pages (titres, longueurs, FAQ, liens, minis)
npx vitest run src/lib/engine                                # le moteur
```

Ne lancez pas `npm run build` ni les contrôles globaux : le coordinateur les lance une fois pour tout le site.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de git commit (le coordinateur commit).
- Ne touchez ni à `_trame`, ni à la RECETTE, ni à un autre site, ni au cœur, ni au moteur, ni à `params-2026.json` :
  un manque ou une erreur va dans le compte rendu.
- Pas de publicité, pas de lien vers un autre site du portefeuille, jamais `pkill -f` avec un motif court.
