// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
// Written for readers aged 7-12: short sentences, everyday words, same facts.
import { TWINS } from './twins.js';
import { INGENUITY } from './ingenuity.js';
import { SOJOURNER } from './sojourner.js';
import { APOLLO12 } from './moon.js';

// Placeholder until Team Rosebital's story arrives; replace with its own file (like sojourner.js).
const pending = {
  tr: { chapters: [{ when: '—', title: 'Hikâye yolda', text: 'Bu hikâye Rosebital Takımı tarafından yazılacak.' }], closing: 'Yakında…' },
  en: { chapters: [{ when: '—', title: 'Story on the way', text: 'This story will be written by Team Rosebital.' }], closing: 'Coming soon…' },
};

export const STORIES = {
  viking1: pending,
  viking2: pending,
  insight: pending,
  apollo11: pending,
  apollo15: pending,

  ...TWINS, // Spirit & Opportunity: the team's own story, see twins.js

  sojourner: SOJOURNER, // the team's own story, see sojourner.js

  ingenuity: INGENUITY, // the team's own story, see ingenuity.js
  apollo12: APOLLO12, // the Moon: Surveyor 3 & Apollo 12, one shared story, see moon.js
};
