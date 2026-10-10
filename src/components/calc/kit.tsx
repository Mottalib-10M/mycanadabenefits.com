/** Pièces communes des simulateurs : cadre deux colonnes, carte de résultat, lignes de détail. */
import type { ReactNode } from 'react';
import { formatMoney } from '../../lib/format';

export type L = 'en' | 'fr';
export const eur = (x: number, l: L, d = 0) => formatMoney(x, d, l);

export function Shell({ form, result, id }: { form: ReactNode; result: ReactNode; id: string }) {
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome data-calc={id}>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">{form}</form>
        <div aria-live="polite" className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">{result}</div>
      </div>
    </div>
  );
}
export const Row2 = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>;

export function Head({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
    </>
  );
}
export function Rows({ rows }: { rows: Array<[string, string] | [string, string, boolean]> }) {
  return (
    <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, v, strong]) => (
        <tr key={l} className={strong ? 'font-semibold' : ''}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{v}</td></tr>
      ))}
    </tbody></table>
  );
}
export const Note = ({ children }: { children: ReactNode }) => <p className="mt-3 text-sm text-navy-700">{children}</p>;
export function MethodLink({ href, lang }: { href?: string; lang: L }) {
  if (!href) return null;
  return <p className="mt-3 text-sm"><a href={href} className="font-medium text-accent-700 underline">{lang === 'fr' ? 'Comment le montant est calculé' : 'How the amount is calculated'}</a></p>;
}
export const yesNo = (l: L) => [{ value: '0', label: l === 'fr' ? 'Non' : 'No' }, { value: '1', label: l === 'fr' ? 'Oui' : 'Yes' }];
export const disclaimer = (l: L) => (l === 'en' ? 'Estimate only: the CRA, Service Canada or your province sets the amount actually paid.' : 'Estimation : l’ARC, Service Canada ou votre province fixe le montant réellement versé.');
