import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'canada-dental-care-plan', group: 'credits', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'canada-dental-care-plan', nav: 'canada-dental-care-plan', card: '', title: '', description: '', h1: 'canada-dental-care-plan', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'regime-canadien-soins-dentaires', nav: 'regime-canadien-soins-dentaires', card: '', title: '', description: '', h1: 'regime-canadien-soins-dentaires', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
