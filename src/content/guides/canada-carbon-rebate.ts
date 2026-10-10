import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'canada-carbon-rebate', group: 'credits', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'canada-carbon-rebate', nav: 'canada-carbon-rebate', card: '', title: '', description: '', h1: 'canada-carbon-rebate', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'remise-canadienne-carbone', nav: 'remise-canadienne-carbone', card: '', title: '', description: '', h1: 'remise-canadienne-carbone', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
