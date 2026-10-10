import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ontario-trillium-benefit', group: 'provinces', order: 10, tool: 'otb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ontario-trillium-benefit', nav: 'ontario-trillium-benefit', card: '', title: '', description: '', h1: 'ontario-trillium-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestation-trillium-ontario', nav: 'prestation-trillium-ontario', card: '', title: '', description: '', h1: 'prestation-trillium-ontario', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
