import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cwb-disability-supplement', group: 'credits', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cwb-disability-supplement', nav: 'cwb-disability-supplement', card: '', title: '', description: '', h1: 'cwb-disability-supplement', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'supplement-invalidite-act', nav: 'supplement-invalidite-act', card: '', title: '', description: '', h1: 'supplement-invalidite-act', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
