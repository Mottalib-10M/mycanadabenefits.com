import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'guaranteed-income-supplement', group: 'oas', order: 10, tool: 'gis',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'guaranteed-income-supplement', nav: 'guaranteed-income-supplement', card: '', title: '', description: '', h1: 'guaranteed-income-supplement', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'supplement-de-revenu-garanti', nav: 'supplement-de-revenu-garanti', card: '', title: '', description: '', h1: 'supplement-de-revenu-garanti', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
