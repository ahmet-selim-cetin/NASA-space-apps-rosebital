// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
// Written for readers aged 7-12: short sentences, everyday words, same facts.
import { TWINS } from './twins.js';
import { INGENUITY } from './ingenuity.js';
import { SOJOURNER } from './sojourner.js';
import { APOLLO12 } from './moon.js';
import { APOLLO11 } from './apollo11.js';
import { APOLLO15 } from './apollo15.js';
import { VIKING1 } from './viking1.js';
import { INSIGHT } from './insight.js';
import { VIKING2 } from './viking2.js';

export const STORIES = {
  viking1: VIKING1, // the team's own story, see viking1.js
  viking2: VIKING2, // the team's own story, see viking2.js
  insight: INSIGHT, // the team's own story, see insight.js
  apollo11: APOLLO11, // the team's own story, see apollo11.js
  apollo15: APOLLO15, // the team's own story, see apollo15.js

  ...TWINS, // Spirit & Opportunity: the team's own story, see twins.js

  sojourner: SOJOURNER, // the team's own story, see sojourner.js

  ingenuity: INGENUITY, // the team's own story, see ingenuity.js
  apollo12: APOLLO12, // the Moon: Surveyor 3 & Apollo 12, one shared story, see moon.js
};
