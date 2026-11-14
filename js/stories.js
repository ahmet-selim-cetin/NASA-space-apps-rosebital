// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
// Written for readers aged 7-12: short sentences, everyday words, same facts.
import { TWINS } from './twins.js';
import { INGENUITY } from './ingenuity.js';
import { SOJOURNER } from './sojourner.js';
import { APOLLO12 } from './moon.js';

export const STORIES = {
  ...TWINS, // Spirit & Opportunity: the team's own story, see twins.js

  sojourner: SOJOURNER, // the team's own story, see sojourner.js

  ingenuity: INGENUITY, // the team's own story, see ingenuity.js
  apollo12: APOLLO12, // the Moon: Surveyor 3 & Apollo 12, one shared story, see moon.js
};
