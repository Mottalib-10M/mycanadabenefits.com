#!/usr/bin/env python3
"""Régénère public/llms.txt depuis le build (RECETTE §21). Usage : npm run build && python3 scripts/build-llms.py && npm run build"""
import glob, html, os, re
import sys
sys.path.insert(0, 'src/data')
SITE = re.search(r'SITE_URL = "(.*?)"', open('src/data/site-config.ts').read()).group(1)
rows = {'fr': [], 'en': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# CalculAides', '', '> Simulateurs des aides versées par les CAF en France métropolitaine, barèmes 2026 : aides au logement (APL, ALF, ALS) au barème du 1er octobre 2026, prime d’activité, RSA, allocations familiales, complément familial, ASF, allocation de rentrée scolaire, prime à la naissance, PreParE, AAH. Édité par Radif Partners, site indépendant sans lien avec la CNAF, les CAF ni la MSA. Chaque montant vient d’un texte officiel (Journal officiel, Légifrance, service-public.fr) et d’un fichier de paramètres daté et testé.', '',
       'Les montants affichés sont des estimations : seule la CAF calcule le droit réel. Tous les calculs se font dans le navigateur, sans cookie.', '']
for lang, titre in (('fr', '## Pages en français'), ('en', '## Pages in English')):
    out.append(titre); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt :', sum(len(v) for v in rows.values()), 'pages')
