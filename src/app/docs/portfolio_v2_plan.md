# Portfolio v2 plan

Working plan for the next round of portfolio changes. All copy below is a draft: edit it here and the build follows this file. Site copy rule: no em dashes.

---

## 1. Decisions locked

| Topic | Decision |
|---|---|
| Capability snapshot | Moves to between Experience and Challenges |
| "More About Me" (hero card) | Deleted. Right card becomes a table of contents only |
| "Say hi" row | Deleted |
| Highlights layout | Grid, 3 columns x 2 rows on desktop (2 cols tablet, 1 col mobile) |
| Highlights cards | Joey, Playi, AI Second Brain, Cycling Coach, Harness-Agnostic Automation Engine, plus a 6th "your problem here" card |
| Career Expansion Second Brain | Folds into AI Second Brain everywhere (highlight card and full tile). Joey is just Joey |
| Developer-PM GitHub Engine | Renamed **Harness-Agnostic Automation Engine**, tagline "Because I don't want to be locked in to one AI lab." |
| Email icon | Opens an email (mailto) and shows the address in a hover tooltip |
| AI Second Brain art | Built in code: a drifting node network (Nexus idea), not a generated image |
| Other card art | Cinematic generated images (prompts in section 6). Joey and Playi use their real logos |
| 6th card | Generated cinematic image (prompt in section 6) |

---

## 2. Page order

```
Hero
  Left:  eyebrow, name, bio, [email] [LinkedIn], "scroll for selected work"
  Right: table of contents (grouped like the sections below)
Highlights            6 cards, image on top
Products              01 Joey, 02 Playi                         (existing full tiles)
Automations & AI workflows
                      03 AI Second Brain, 04 Cycling Coach, 05 Harness-Agnostic Automation Engine
Experience            Mitie, JLL                                (new)
Capability snapshot   pill grid, moved from Highlights
Challenges            London to The Hague, Chasing the Dragon, Lap of Mallorca   (new)
Footer
```

Right-hand table of contents (the hover line under each title is its subtitle):

```
*  Highlights
PRODUCTS
01 Joey
02 Playi
AUTOMATIONS & AI WORKFLOWS
03 AI Second Brain
04 Cycling Coach
05 Automation Engine        (full name may truncate here)
EXPERIENCE
CHALLENGES
```

---

## 3. Hero

**Bio (Michael's words, verbatim):**

> I just really like to build things that solve people's problems and make them happy. At Mitie I did this by shadowing and embedding myself into the worlds of the operators that I was building the products for. For myself, I do this by building products and automations that solve challenges I'm having.
>
> Besides building, I spend far too much time riding my bike. Biking has helped me build amazing communities across the world and lets me challenge myself to see where my limits are. Check out the dumb challenges I've done below.

- Email + LinkedIn icons sit under the bio, above the scroll cue. Reuse the footer icons.
- Eyebrow ("Product manager · mediocre cyclist · building with AI") and the "Open to new problems" pill stay.

---

## 4. Background orb

- Today it only moves on scroll (position is a function of scroll progress), so it's frozen on landing.
- New: a slow, uneven drift on its own (about 40 to 60 second loop). Scrolling adds an extra push on top.
- Colour slowly cycles orange (#F76B15), peach (#FDBF74), soft coral.
- Built as a blurred element moved with `transform`, not a repainted gradient, so constant motion stays cheap.
- Holds still when the visitor's system asks for reduced motion.
- Strength tuned live so it's noticeable but never fights the text.

---

## 5. Highlights

### Card anatomy (from the reference)

1. Image area on top, number badge in the corner (01 to 05; "+" on the 6th card). Joey and Playi get a glass "Live ↗" button over the image on hover.
2. Small category label
3. Title (plus a one-line italic tagline on the Automation Engine card)
4. **What:** one line
5. **Problem:** one line
6. Stat: one headline line, optionally a second smaller line
7. Footer: status dot + label on the left, "Full story →" pill on the right (scrolls to the full tile). The 6th card's pill is "Email me →".

### Copy

| # | Title | What | Problem | Stat | Status |
|---|---|---|---|---|---|
| 01 | Joey | Custom resume generator built on your career knowledge graph | Tailoring a resume for every job takes too long | 30 → 10 min per application | Live |
| 02 | Playi | Adaptive sales playbook for sales teams | Playbooks go stale the week they're published and no one knows exactly how the best rep keeps selling | 15+ design partners<br>40% token cut, found through a full eval build | Used by design partners |
| 03 | AI Second Brain | One context engine for everything I work on: AI research, my career history, books and notes, and every product spec and plan | Every time a better model or harness came out, I had to seed my context from scratch | 66 links between my AI research and Joey's build docs<br>5,100+ notes in one vault | Live |
| 04 | Cycling Coach | An AI coach using my ride and qualitative data to rehab me back from injury | Strava ride data was a tiny piece of the puzzle. I needed my qualitative injury feel data and leading ITB rehab research all analyzed together | 416h of training analyzed YTD | Live |
| 05 | Harness-Agnostic Automation Engine<br>*Because I don't want to be locked in to one AI lab.* | Scheduled GitHub jobs that keep my second brain clean and current, and keep Joey's models from going stale | Harness automation features lock you in, and paying an LLM to do deterministic work wastes money | ~$0.50 a month in LLM costs<br>9 jobs running | Live |
| + | Your problem here | Got a problem you want solved? | Tell me about it. I like the weird ones. | | Open to new problems |

### What the Automation Engine actually is

9 GitHub Actions workflows across two repos (`Second-Brain` and `resume-product`). Python does the routine work; a model is called only where judgement is needed; jobs exit early when there's nothing new, so most runs cost nothing. 7 jobs make an LLM call, 2 are plain Python.

| Job | Repo | When | LLM? | What it does |
|---|---|---|---|---|
| **Model watch** | Joey | Mondays | Yes | Scans 7 AI labs (Google, OpenAI, Anthropic, DeepSeek, xAI, Moonshot, Meta) for new models, price changes, ending promotions and retirements. Proposes updates to Joey's model registry in one standing PR that Michael merges by hand. Declined changes stay declined for 180 days. Emails only when there's news |
| Market intelligence ingest | Second Brain | Daily | Yes | Classifies new AI clippings, updates wiki pages and hubs, files the raw clips |
| Joey wiki maintenance | Second Brain | Daily | Yes | Turns unprocessed build transcripts into spec updates with source backlinks |
| Career engine memory curator | Second Brain | Daily | Yes | Consolidates what the resume pipeline learned, lints style rules, rebuilds indexes |
| Joey index freshness audit | Second Brain | Daily | Yes | Checks that key docs haven't gone stale and patches index drift |
| Todoist to Airtable sync | Second Brain | Daily | No | Copies completed tasks into Airtable |
| Market intelligence weekly brief | Second Brain | Mondays | Yes | Writes the weekly brief, grounded against Joey's architecture |
| Market intelligence lint | Second Brain | Monthly | Yes | Fixes broken links and frontmatter, finds orphan and stale pages, writes a health report |
| Automation PR merger | Second Brain | Every 30 min + on PR | No | Rules-based merge: branch allowlist + path fences, with tests |

Every change lands as a PR, and PRs from different agents and harnesses go through the same merger. Model watch is the clearest proof of the tagline: it tracks 7 labs so Joey can move to whichever model is best and cheapest that week.

---

## 6. Card art

### Joey and Playi

Real logos, placed in code:
- **Joey:** the J mark (vector path in `resume-product/apps/web/src/components/shell/joeyMarkPath.ts`) in terracotta `#8F3720`, plus "Joey" in Plus Jakarta Sans Bold.
- **Playi:** the parrot + serif wordmark (`sales-grader-app/public/logo-full-v2.png` / `logo-full.svg`).

Each logo sits on a generated cinematic **backdrop plate** (prompts below), so the two logo cards match the rest of the grid. Without plates, they fall back to a soft brand-tinted gradient.

### AI Second Brain

Built in code. Nexus idea: an airy, roughly circular cloud of nodes with faded edges. It has variable node sizes, thin connecting lines, and sparse labels using the real domains (*AI landscape, Career history, Books & notes, Product specs, Implementation plans*). It drifts gently, and connections light up on hover. Tuned to sit with the cinematic set, most likely as warm glowing nodes on a deep, warm-dark background, like a night sky.

### Image prompts (for a separate image model)

**Shared style block.** Paste this at the start of every prompt:

> Cinematic film still. Shot on 35mm film through an anamorphic lens: shallow depth of field, natural volumetric light through atmospheric haze, gentle halation on the highlights, fine film grain. Colour grade: warm amber and burnt-orange highlights, soft peach midtones, deep warm-brown shadows, blues and teals kept muted. One clear subject with generous negative space, composed on the rule of thirds. Photoreal, quiet and moody, like a frame from a slow, contemplative art-house film. No text, letters, numbers, logos, signage or watermarks, and no recognisable faces. 16:10 landscape, 2400 x 1500 or larger.

**04 Cycling Coach**

> Blue hour, just before sunrise, high in the mountains. A lone road cyclist climbs an empty switchback road, seen from far above and across the valley, small in the frame. A long-exposure ribbon of warm orange light trails behind the bike all the way up the switchbacks, its line rising and falling like a heart-rate trace. Low cloud fills the valley below; the first sunlight is just touching the ridge line above. The rider is a silhouette; the light trail and the road carry the image.

**05 Harness-Agnostic Automation Engine**

> Night, light rain. A vast railway switching yard seen from a high, wide angle: dozens of tracks fan out in every direction and disappear into fog, each one a different route. In the middle sits one small signal box, its windows glowing warm orange, the only lit building in the yard. Wet rails and puddles reflect sodium-orange lamps. No trains, no people. The mood: one quiet operator who can send anything down any line, working through the night.

**+ Your problem here**

> Dusk on a quiet, rain-washed side street. The tall wooden door of a small workshop stands half open, and warm orange lamplight spills out across the wet cobblestones toward the camera. Through the gap, out of focus: a workbench with a single lamp switched on, tools hung on a pegboard, a stool pulled out as if waiting for someone. Nobody in frame. Fine drizzle catches the light. The feeling is an open invitation: come in, bring the problem.

**01 Joey: backdrop plate** (the logo is added in code, so keep the centre empty)

> Early morning light falls through a tall window across a wide desk covered in loose sheets of cream paper, slightly overlapping, a few with soft terracotta-red edges. Dust drifts slowly in the beam. The centre of the frame is a calm, evenly lit expanse of clean paper with nothing on it. Soft, quiet, hopeful. Lean the grade toward cream and terracotta (#8F3720).

**02 Playi: backdrop plate** (the logo is added in code, so keep the centre empty)

> Deep inside a rainforest canopy at golden hour: layers of large tropical leaves in deep emerald and sage green, backlit so their veins glow, with mist drifting between the layers. The centre of the frame opens into a soft, out-of-focus clearing of warm light with nothing in it. Lush, calm, alive. Keep the shared grade but let the greens lead.

Tips: generate the whole set in one session so the grade stays consistent. Ask for 4 variations of each and export at 2400 px wide or more. Drop the files in `public/art/` and the build handles cropping and compression.

### Received (13 Oct 2026)

Delivered as `public/Card Images- *.png`. The build converts each to WebP in `public/art/` and removes the originals.

| File | Size | Use | Crop / treatment |
|---|---|---|---|
| `+ Your problem here` | 1586x992 | 6th card | Native 16:10, centre crop |
| `01 Joey- backdrop plate` | 1586x992 | Joey card | Native 16:10; J mark + "Joey" placed directly on the paper in the centre |
| `02 Playi- backdrop plate` | 1983x793 (2.5:1) | Playi card | Crop toward the misty valley (left of centre) so the logo sits on warm mist; logo on a soft frosted cream backing for contrast against the greens |
| `04 Cycling Coach` | 1983x793 (2.5:1) | Cycling Coach card | Crop slightly right of centre: keeps the rider and most of the light-trail switchbacks |
| `05 Harness-Agnostic Automation Engine` | 1586x992 | Automation Engine card | Native 16:10, centre crop |

### Favicon (tab icon)

Replace the default Vercel icon with an "M" monogram that matches the site: the Newsreader "M" in cream (#FDFDFC) on a softly rounded warm near-black (#21201C) tile, with an optional small orange (#F76B15) full stop, the only colour. Default: built in code as an SVG app icon (crisp at 16px, true to the site font, with a dark-mode variant), plus a PNG Apple touch icon. Check the Next.js app-icon conventions in `node_modules/next/dist/docs/` before implementing. If Michael generates an image version, compare the two and pick one.

---

## 7. Products and Automations (full tiles)

- **Joey** subtitle: "AI Career Engine Coach" → **"Custom Resume Generator"**
- **Playi** subtitle: "B2B Adaptive Sales Playbook" → **"Adaptive Sales Playbook for Sales Teams"**
- **Developer-PM GitHub Engine** → title **"Harness-Agnostic Automation Engine"**, subtitle **"Because I don't want to be locked in to one AI lab"**. Intro and metrics rewritten around the table in section 5 (Claude drafts, Michael edits).
- **Career Expansion Second Brain** tile removed. Its 4 slides join the AI Second Brain carousel (10 slides total).
- **AI Second Brain** tile: intro rewritten to match the broader scope (Claude drafts, Michael edits).
- Renumber: 01 Joey, 02 Playi, 03 AI Second Brain, 04 Cycling Coach, 05 Automation Engine.
- Section headings added: "Products" and "Automations & AI workflows".

---

## 8. Experience (new)

One card per role: company, title, place and dates, a one-line context, 3 to 4 bullets and one headline stat. No images.

**Product Manager · Mitie** · London · Jan 2024 to present
*The UK's largest facilities management company. I was the second hire on a brand-new product team.*
- Shadowed cleaning teams and risk analysts on site and ran journey workshops across our top 20 accounts, then turned what I learned into PRDs and the roadmap for two 0-to-1 products.
- **Intelligent Cleaning:** swapped static cleaning schedules for data-driven ones. Cost to serve fell 4.5% across 690+ sites within two months.
- **Intelligent Security:** pulled 8+ operational systems into one risk view, saving 30 analyst-hours per account per month.
- Pendo tracking plus help guides and video demos cut 1:1 walkthroughs by ~80% as we scaled from ~10 to 690+ sites.
- Headline stat: **4.5% lower cost to serve, 690+ sites**

**Corporate Strategy Analyst · JLL Technologies** · Vancouver · May 2021 to Nov 2023
*JLL's technology division: software, data and services for commercial real estate.*
- Market sizing, competitor and pricing analysis for PropTech, presented directly to the JLLT CEO.
- On a three-person team, led the adjacent-markets workstream for an acquired property-management software product: evaluated 20+ capabilities and recommended a vendor marketplace.
- Worked with JLL Spark, JLL's venture arm, on build / buy / invest calls.
- Wrote Python scripts that took market scans from quarterly to monthly, saving 20+ hours of manual work.
- Headline stat: **20+ capabilities evaluated**

Kept off the public site on purpose: the acquired product's name, the ~28% ARR growth figure, and internal screenshots (the old portfolio that had them was password-protected).

---

## 9. Capability snapshot

Move the existing pill grid (with its filters) unchanged to sit between Experience and Challenges. Drop the "Key takeaways" block that's currently attached to it; the Highlights cards replace it.

---

## 10. Challenges (new)

Same card component as Highlights: photo on top, title, date and place, 3 stats, one line. "Read the story" expands to the full write-up. Newest first.

| | London to The Hague in a day | Chasing the Dragon | The Lap of Mallorca |
|---|---|---|---|
| Date | 11 May 2026 | 21 to 22 June 2025 (back to back) | 24 May 2025 |
| Where | London to The Hague, 4 countries | Chase the Sun (Sat) + Dragon Devil (Sun), London to Wales | Mallorca 312 + Sa Calobra |
| Distance | 448 km | 563 km | 325 km |
| Elevation | 1,673 m | 5,250 m | 4,572 m |
| Time | 15h33 moving (24h30 elapsed) | 20.5 h | 12.4 h |
| One line | 4 countries, 2 best mates, and a cumulative 0 hours of sleep. Wouldn't do it any different. | Two flats, a dead phone and mild hypothermia in a Welsh storm. DNF at km 255. The real test was staying calm and finding a way out. | The last day of a week of riding. A 5:30am start under the stars, a seized lower back in the heat, and Sa Calobra to ourselves at sunset. |
| Cover photo | `public/the_hague_1.png` (finish) | `chasing_the_dragon.JPG` | `the_lap_of_mallorca.jpg` |
| More photos | the_hague_3 (Belgian border), 4, 5, 6, 2 (route map) | dragon map + 3 b-roll | Strava route + elevation |
| Full story | Short, below | Michael's write-up from the old portfolio | Michael's write-up from the old portfolio |

**The Hague story (Michael's words, lightly tidied):**

> Every year I challenge myself to do one monumental, exceedingly challenging thing that really pushes my limits. This year I was lucky enough to do it with two of my best friends, who I met during my three years living in London, right before I left the UK for my next journey.

Source for Dragon and Mallorca: `~/CascadeProjects/PM_Portfolio/src/pages/index.js` and `public/images/`. Port the stories as written, fixing typos only ("dehdryation", "Sa Callobra", "at the pack of our pace line").

Photos get converted to WebP at a sensible size (the Hague PNGs are 2.5 to 4.5 MB each).

---

## 11. Fixes

- **Cycling Coach tile metrics** (the numbers don't match their labels, and the totals are stale):
  - 136 rides → "RIDES YTD, AFTER A 4-MONTH ITB INJURY"
  - 105 lifts → "STRENGTH SESSIONS YTD"
  - 352.5 hours → **416 hours**, "TOTAL TRAINING YTD, LIVE FROM AIRTABLE" (matches the highlight card)
  - 350 watts → unchanged
  - Refresh the ride and lift counts from Strava at build time, so they line up with 416h.
- **Highlights typos** ("noice", "sovled", "versional", "quicky"): gone with the rewrite.
- **Playi tile:** "why or why they are not verifying" → "why they are or aren't verifying".
- **Housekeeping:** delete the stale root `Portfolio.tsx`; nothing imports it.

---

## 12. Open items

1. **Generated art:** received 13 Oct (see section 6). Favicon: SVG in code unless Michael prefers a generated version.
2. **AI Second Brain stat source:** `Second Brain/personal/second-brain-stats-2026-10-13.md` ("Unexpected bridges": Market intelligence <-> Joey = 66 directed links, both directions; inventory 5,123 Markdown files). These are links, not a count of techniques adopted, so the wording says "links".
3. **Tile rewrites** (AI Second Brain, Automation Engine): Claude drafts during build step 3, Michael edits.

---

## 13. Build order

1. **Housekeeping (no visual change):** move content into one data file, split sections into components, delete the root `Portfolio.tsx`.
2. **Quick wins:** bio, contact icons + tooltip, remove "More About Me" and "Say hi", subtitles and the rename, metric fixes and typos, orb, favicon.
3. **Restructure:** section headings, fold Career Expansion into AI Second Brain, renumber, grouped table of contents, move the capability snapshot, tile rewrites.
4. **Highlights:** card component, copy, Joey and Playi logo tiles, the animated AI Second Brain network, temporary placeholders for generated art.
5. **Experience + Challenges:** cards, compressed photos, expandable stories.

Generated art drops in whenever it's ready.
