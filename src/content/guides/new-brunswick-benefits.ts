import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'new-brunswick-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'new-brunswick-benefits', nav: 'new-brunswick-benefits', card: '', title: '', description: '', h1: 'new-brunswick-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-nouveau-brunswick', nav: 'prestations-nouveau-brunswick', card: '', title: '', description: '', h1: 'prestations-nouveau-brunswick', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
