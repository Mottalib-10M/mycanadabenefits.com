import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'gis-work-exemption', group: 'oas', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'gis-work-exemption', nav: 'gis-work-exemption', card: '', title: '', description: '', h1: 'gis-work-exemption', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'srg-revenu-emploi', nav: 'srg-revenu-emploi', card: '', title: '', description: '', h1: 'srg-revenu-emploi', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
