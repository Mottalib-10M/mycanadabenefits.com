#!/usr/bin/env python3
"""Régénère public/llms.txt depuis le build (RECETTE §21). Usage : npm run build && python3 scripts/build-llms.py && npm run build"""
import glob, html, os, re
import sys
sys.path.insert(0, 'src/data')
SITE = re.search(r'SITE_URL = "(.*?)"', open('src/data/site-config.ts').read()).group(1)
rows = {'en': [], 'fr': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# BenefitLedger', '', '> Canadian federal and provincial benefits and public pensions for 2026, in English and French: Canada child benefit, Canada Groceries and Essentials Benefit (the former GST/HST credit, renamed in July 2026), Canada workers benefit, Canada Disability Benefit, CPP, OAS, GIS, the Allowance, RRIF minimums, and provincial programs (Ontario Trillium Benefit, Quebec family allowance, BC family benefit, Alberta child and family benefit, Atlantic and territorial programs), with every 2026 payment date. Published by Radif Partners, an independent site with no link to the Government of Canada, the CRA, Service Canada or any province. Every amount comes from canada.ca, the CRA, ESDC, laws-lois.justice.gc.ca, Retraite Québec or a provincial government, in a dated, tested parameter file.', '',
       'Amounts are estimates: the CRA, Service Canada or the province sets the amount paid. All calculations run in the browser, with no cookie.', '']
for lang, titre in (('en', '## Pages in English'), ('fr', '## Pages en français')):
    out.append(titre); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt :', sum(len(v) for v in rows.values()), 'pages')
