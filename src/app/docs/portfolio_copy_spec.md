# Specification Sheet: Cycling Coach Dashboard Copy & Component Update

This specification details the copy changes and layout additions required to update the "Claude the Cycling Coach" component to "Antigravity Cycling Coach" on the personal portfolio site. It incorporates the transitions to Next.js, live Airtable data rendering, GitHub Actions/Antigravity daily schedules, and the athlete feedback loop.

---

## 1. Updated Component Structure & Copy

### Header & Titles
*   **Category Label:** `04 — PERSONAL AI · ENDURANCE PERFORMANCE`
*   **Project Title:** `Antigravity Cycling Coach`
*   **Subtitle:** `Live Dashboards & Professional AI Coaching`

### Main Description Paragraph
> *No em-dashes permitted.*
> 
> "An elite-level training intelligence engine built on Next.js that processes raw sensor streams (power, heart rate, cadence) directly from the Strava API. The system performs advanced mathematical modeling, including cardiac drift (aerobic decoupling), Normalized Power (NP), and a dynamic CTL/ATL fatigue decay model, to compute performance metrics far beyond Strava's out-of-the-box analytics. Using daily scheduled workflows (GitHub Actions scripts and Antigravity agentic scheduled tasks), an autonomous Antigravity AI Agent processes these metrics along with my subjective training feedback in Airtable to self-correct, adapt training plans, and write morning coaching digests."

### Key Stats
*   **Stat 1 (Activity Count):**
    *   **Label:** `YTD ACTIVITY LOG`
    *   **Value:** `112 rides + 56 lifts` *(Or update with current count)*
    *   **Subtext:** `RAW STRAVA FILES CONSUMED VIA PYTHON API PIPELINE`
*   **Stat 2 (Volume):**
    *   **Label:** `DATA PIPELINE`
    *   **Value:** `280+ hours` *(Or update with current count)*
    *   **Subtext:** `SERVER-SIDE RETRIEVED FROM LIVE AIRTABLE INGESTION ENGINE`
*   **Stat 3 (Target / Metric):**
    *   **Label:** `TRAINING TARGET`
    *   **Value:** `350 watts`
    *   **Subtext:** `FTP TARGET. 8 COGGAN POWER ZONES. ZERO GUESSWORK.`
*   **Live Status Indicator:** `● Updated live with Strava & Airtable: June 4`

---

## 2. Interactive Additions (Playi-style Accordion)

Add a state-controlled disclosure component immediately beneath the main description paragraph.

*   **Collapsed Toggle Label:** `EXPAND FOR TECHNICAL DETAILS... v`
*   **Open Toggle Label:** `COLLAPSE DETAILS ^`
*   **Expanded Text Block:**
    > "Built as a fully custom, self-improving training engine, the real complexity lives in the automated closed feedback loop. Raw data is server-side rendered directly from Airtable, ensuring the dashboard is always hydrated with live metrics. Every activity logged on Strava triggers a scheduled GitHub Actions workflow that streams raw sensor data into our Python math engine. Here, we run decay calculations to track CTL (Fitness), ATL (Fatigue), and TSB (Form), along with cardiac drift (Pa:HR) metrics to flag aerobic decoupling. Every morning, an autonomous Antigravity AI Agent runs an analysis on the updated metrics, cross-references my subjective recovery notes and IT-band pain logs in Airtable, and writes back detailed coaching narratives. These narratives actively shape future workout intensities, closing the loop from raw biometrics to physical adaptations."

---

## 3. Technical Stack Grid (Footer Layout)

Create a 3-column grid below the stats section to organize the core platform technologies.

```
+---------------------------------+---------------------------------+---------------------------------+
|          CORE PLATFORM          |        DATA & BIOMETRICS        |       AGENTIC AI & CRONS        |
+---------------------------------+---------------------------------+---------------------------------+
| Next.js 16                      | Strava API                      | Antigravity SDK                 |
| SSR APP ROUTER & VERCEL         | RAW STREAM INGESTION            | MORNING COACHING NARRATIVES     |
|                                 |                                 |                                 |
| Airtable API                    | Python Engine                   | GitHub Actions                  |
| LIVE DATA REVALIDATION          | NP, TSS, CARDIAC DRIFT, &       | DAILY/WEEKLY SCHEDULES          |
|                                 | CTL/ATL/TSB                     |                                 |
+---------------------------------+---------------------------------+---------------------------------+
```

---

## 4. Execution Prompt for Antigravity IDE

*Copy and paste the prompt below directly into the agent prompt box on your portfolio repository to automate the implementation.*

```text
Please update our personal portfolio page to replace the "Claude the Cycling Coach" project section with the new "Antigravity Cycling Coach" implementation. 

Follow these steps exactly:
1. Locate the component or page rendering the "Claude the Cycling Coach" card (check for text matches like "93 rides + 50 lifts" or "aerobic decoupling").
2. Update the main titles, subtitle, and primary description:
   - Category: "04 — PERSONAL AI · ENDURANCE PERFORMANCE"
   - Title: "Antigravity Cycling Coach"
   - Subtitle: "Live Dashboards & Professional AI Coaching"
   - Body copy (strictly no em-dashes): "An elite-level training intelligence engine built on Next.js that processes raw sensor streams (power, heart rate, cadence) directly from the Strava API. The system performs advanced mathematical modeling, including cardiac drift (aerobic decoupling), Normalized Power (NP), and a dynamic CTL/ATL fatigue decay model, to compute performance metrics far beyond Strava's out-of-the-box analytics. Using daily scheduled workflows (GitHub Actions scripts and Antigravity agentic scheduled tasks), an autonomous Antigravity AI Agent processes these metrics along with my subjective training feedback in Airtable to self-correct, adapt training plans, and write morning coaching digests."
3. Update the three key stats:
   - Stat 1: Label "YTD ACTIVITY LOG", Value "112 rides + 56 lifts" (or whatever dynamic value binds), Subtext "RAW STRAVA FILES CONSUMED VIA PYTHON API PIPELINE"
   - Stat 2: Label "DATA PIPELINE", Value "280+ hours" (or bound value), Subtext "SERVER-SIDE RETRIEVED FROM LIVE AIRTABLE INGESTION ENGINE"
   - Stat 3: Label "TRAINING TARGET", Value "350 watts", Subtext "FTP TARGET. 8 COGGAN POWER ZONES. ZERO GUESSWORK."
   - Update the updated date label: "● Updated live with Strava & Airtable" (use dynamic date if bound, else static current date).
4. Implement a Playi-style expandable details accordion below the main description:
   - Add a toggle state button: "EXPAND FOR TECHNICAL DETAILS... v" / "COLLAPSE DETAILS ^"
   - In the expanded container, display the following summary block:
     "Built as a fully custom, self-improving training engine, the real complexity lives in the automated closed feedback loop. Raw data is server-side rendered directly from Airtable, ensuring the dashboard is always hydrated with live metrics. Every activity logged on Strava triggers a scheduled GitHub Actions workflow that streams raw sensor data into our Python math engine. Here, we run decay calculations to track CTL (Fitness), ATL (Fatigue), and TSB (Form), along with cardiac drift (Pa:HR) metrics to flag aerobic decoupling. Every morning, an autonomous Antigravity AI Agent runs an analysis on the updated metrics, cross-references my subjective recovery notes and IT-band pain logs in Airtable, and writes back detailed coaching narratives. These narratives actively shape future workout intensities, closing the loop from raw biometrics to physical adaptations."
5. Add a 3-column technical stack footer grid (referencing the styling in our Playi component):
   - Column 1 (CORE PLATFORM):
     * "Next.js 16" / Sub: "SSR APP ROUTER & VERCEL"
     * "Airtable API" / Sub: "LIVE DATA REVALIDATION"
   - Column 2 (DATA & BIOMETRICS):
     * "Strava API" / Sub: "RAW STREAM INGESTION"
     * "Python Engine" / Sub: "NP, TSS, CARDIAC DRIFT, & CTL/ATL/TSB"
   - Column 3 (AGENTIC AI & CRONS):
     * "Antigravity SDK" / Sub: "MORNING COACHING NARRATIVES"
     * "GitHub Actions" / Sub: "DAILY/WEEKLY SCHEDULED WORKFLOWS"

Verify that formatting is clean, responsive on mobile/desktop viewports, and builds successfully.
```
