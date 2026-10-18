# NSBE Unilorin Website --- Design Guide

**Status:** Research synthesis and implementation guide\
**Reference archive:** `NSBE DESIGN INSPO.zip`\
**Evidence reviewed:** 12 screenshots (9 in `components/`, 3 in
`fonts/`)\
**Important:** This document distinguishes what is visible in the
references from recommendations for the NSBE Unilorin website.
Recommendations are not claims about official NSBE brand standards.

------------------------------------------------------------------------

## 1. Purpose and scope

This guide translates the supplied design-inspiration screenshots into a
practical design direction for the NSBE Unilorin branch website. The
site should present a credible engineering community while making useful
academic resources easy to find.

The intended product has two related experiences:

1.  **Public-facing chapter website:** introduce the chapter, explain
    its mission and activities, show events and programs, present
    verified leadership, display sponsors and partners, and make it easy to get involved.
2.  **Academic resource hub & admin system:** help students discover past questions, lecture materials, and learning resources by department, level (100L–500L), course, and resource type; explore final-year project work; express interest in tutorials via a secure interest form; and allow authorized executives to manage content and resources securely via Supabase.

These experiences should feel like one coherent organization, not two
unrelated websites. The public pages can use editorial storytelling; the
resource hub should prioritize search, filters, clarity, and speed.

### Design principle

**Institutional credibility + student usefulness.** Aim for the
confidence and restraint of a professional engineering association, the
warmth of a campus community, and the usability of a well-organized
academic library.

Do not attempt to combine every reference style. The screenshots show
several different visual languages; use them selectively.

------------------------------------------------------------------------

## 2. Evidence and confidence labels

Use these labels when interpreting this guide:

-   **Observed:** directly visible in one or more supplied screenshots.
-   **Recommendation:** a proposed design decision for this project, not
    a measured property of the screenshots.
-   **Provisional:** a recommendation that must be confirmed with the
    chapter, official assets, or implementation testing.
-   **Unresolved:** the available references do not provide enough
    evidence to make a reliable claim.

The archive contains 15 ZIP entries in total: 3 directory entries and 12
image files. All 12 screenshots were visually inspected. The nine
`components/` images are component or page references; the three
`fonts/` images show typography in context. **No actual font files were
included.** Font families, weights, licensing, and metadata therefore
cannot be verified from the archive.

The screenshots are inspiration, not proof of NSBE Unilorin's existing
brand system. Do not describe any sampled colour or typeface as an
official NSBE specification unless separately confirmed.

------------------------------------------------------------------------

## 3. What the references show

### 3.1 Typography references (`fonts/`)

  ----------------------------------------------------------------------------------------------------------------------
  Reference file                                               Observed              What it may       Limits
                                                               characteristics       inform            
  ------------------------------------------------------------ --------------------- ----------------- -----------------
  `NSBE DESIGN INSPO/fonts/Screenshot 2026-10-16 200720.png`   Light, warm           A human,          The image does
                                                               education-oriented    editorial tone    not establish the
                                                               page; spacious        for mission,      exact font family
                                                               composition;          chapter           or official
                                                               prominent             introduction, or  colours.
                                                               high-contrast serif   educational       
                                                               headline; restrained  impact.                    
                                                               yellow-green accent.                    

  `NSBE DESIGN INSPO/fonts/Screenshot 2026-10-16 200904.png`   Dark creative/AI      Contrast between  Its dark,
                                                               site; dramatic        expressive        AI-studio
                                                               headline with a       headlines and     aesthetic should
                                                               serif-like display    practical body/UI not be copied
                                                               character paired with typography. wholesale for an
                                                               cleaner supporting                      engineering
                                                               type; rounded visual                    student
                                                               area and subtle                         association.
                                                               gradient treatment.                     

  `NSBE DESIGN INSPO/fonts/Screenshot 2026-10-16 200953.png`   Large bold            Strong headline   Exact font and
                                                               technology-oriented   hierarchy and a   colour values
                                                               headline, dark text,  restrained        cannot be
                                                               blue/cyan accent,     technical accent. identified
                                                               generous whitespace.                    reliably from a
                                                                                                       screenshot.
  ----------------------------------------------------------------------------------------------------------------------

**Observation:** The references demonstrate that typography can create
personality without requiring elaborate decoration. They do not
establish one consistent font family across all examples.

**Recommendation:** Use one expressive display face for selected large
headings and one highly legible sans-serif for body text, navigation,
forms, labels, and resource metadata. Keep the pairing consistent across
the site. Do not use the display face for long paragraphs or small
interface labels.

**Provisional font direction:** test a readable serif display face such
as *Source Serif 4* or *DM Serif Display* with a sans-serif such as
*Inter* or *Manrope*. These are candidate recommendations only---not
fonts identified in the screenshots. Check licensing, available weights,
performance, and the chapter's preference before committing. Prefer
self-hosted, optimized font files where practical, with sensible system
fallbacks.

### 3.2 Components and page references (`components/`)

  ---------------------------------------------------------------------------------------------------------------------------------
  Reference file                                                    Observed characteristics    Useful lesson     Adaptation
                                                                                                                  caution
  ----------------------------------------------------------------- --------------------------- ----------------- -----------------
  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 204401.png` Bright, rounded feature     A small number of The vivid palette
                                                                    cards using contrasting     feature cards can and heavy
                                                                    coral/orange, blue, and     make distinct     rounding are not
                                                                    green panels; one card      initiatives easy  a suitable
                                                                    includes a circular         to scan. default for every
                                                                    play/video control.                           NSBE section.

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 204634.png` Dark technology/agency      A clear hero can  Avoid copying the
                                                                    hero, prominent headline,   pair a strong     dark agency
                                                                    orange accent, product      statement with    aesthetic,
                                                                    visual, small floating      one visual and    floating
                                                                    circular elements, rounded  one primary       decoration, or
                                                                    CTA.              action. sales-oriented
                                                                                                                  tone as the whole
                                                                                                                  site identity.

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 205300.png` Minimal light section with  Use concise       Ensure tiles
                                                                    a large heading, short      section           represent real
                                                                    supporting copy, and        introductions     destinations or
                                                                    colourful rectangular       followed by       information; do
                                                                    content tiles.    organized         not add
                                                                                                content.  decorative blocks
                                                                                                                  without purpose.

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 205528.png` "How we work"               A step sequence   Use a timeline
                                                                    process/timeline with       can explain       only where order
                                                                    numbered steps, a           membership,       matters; do not
                                                                    connecting line, dots, and  submitting a      force every page
                                                                    restrained monochrome       resource, or      into a process
                                                                    styling.          joining a         diagram.
                                                                                                program.          

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 205654.png` Narrow row of three feature Compact benefits  Three-card rows
                                                                    cards with icons and short  or quick-link     are one option,
                                                                    descriptions; strongly      summaries can     not a default
                                                                    rounded corners.  work in a limited pattern for all
                                                                                                area.   content.

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 205723.png` Minimal                     Community         Replace generic
                                                                    community/nonprofit-style   storytelling can  donation-style
                                                                    page, large headline,       feel warm without messaging with
                                                                    restrained navigation,      excessive visual  authentic chapter
                                                                    orange circular image       effects.  goals and calls
                                                                    treatment, generous                           to action.
                                                                    whitespace.                                   

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 210849.png` Programs and initiatives    This is a strong  Do not copy the
                                                                    page; editorial headline    reference for     layout or content
                                                                    with blue accent; short     presenting        verbatim. Use
                                                                    introduction; category      chapter programs  only relevant
                                                                    pills; asymmetrical         by audience or    categories and
                                                                    photography cards with dark theme, with       real local
                                                                    overlays.         photography and   program
                                                                                                concise           information.
                                                                                                descriptions.     

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 210919.png` Partner section with a      A partner/sponsor Show logos only
                                                                    short introduction, CTA,    strip can be      for confirmed
                                                                    and a grid of logos in      orderly and       partners and only
                                                                    bordered cells.   secondary to the  with permission
                                                                                                main content. where required.
                                                                                                                  Never invent
                                                                                                                  partnerships.

  `NSBE DESIGN INSPO/components/Screenshot 2026-10-16 211209.png` Chapter executive-board     Leadership can be The year, people,
                                                                    section with group          presented as a    roles, and labels
                                                                    photograph, "Chapter        real team, with a belong to the
                                                                    Executive Board 2025--2026" group photo and   reference---not
                                                                    heading, "Administrative    clear hierarchy. necessarily the
                                                                    Zone" label, warm neutral                     current Unilorin
                                                                    background, serif type, and                   chapter. Use
                                                                    fine horizontal rule.               verified current
                                                                                                                  details and
                                                                                                                  authentic images.
  ---------------------------------------------------------------------------------------------------------------------------------

### 3.3 Overall synthesis

**Observed:** The references span warm editorial education design, dark
technology design, colourful cards, process diagrams, program
photography, partner-logo grids, and an executive-board presentation.

**Recommendation:** Adopt the **editorial institutional** references as
the main visual language, use the programs page as inspiration for real
initiatives, and borrow card/timeline patterns only when they improve
comprehension. Give the academic resource hub a simpler, more functional
interface that shares the same type, colour, spacing, and button system.

Do not combine dark AI styling, bright multicolour cards, orange
circular imagery, and every other pattern into one page. That would make
the site feel assembled from unrelated templates.

------------------------------------------------------------------------

## 4. Proposed visual direction

Everything in this section is a **recommendation** and should be
reviewed against official NSBE brand assets before implementation.

### 4.1 Colour tokens (provisional)

  -----------------------------------------------------------------------
  Token                   Suggested value         Intended use
  ----------------------- ----------------------- -----------------------
  `--color-ink`           `#171B24`               Main text and strong
                                                  headings

  `--color-navy`          `#182D4D`               Institutional emphasis,
                                                  selected dark sections,
                                                  footer

  `--color-blue`          `#315FA8`               Primary links, focus
                                                  states, selected
                                                  actions

  `--color-blue-dark`     `#244778`               Hover/active state and
                                                  higher-contrast blue
                                                  text

  `--color-page`          `#F7F7F4`               Warm off-white page
                                                  background

  `--color-surface`       `#FFFFFF`               Cards, menus, resource
                                                  panels

  `--color-muted`         `#5F6876`               Secondary copy and
                                                  metadata

  `--color-border`        `#E0E4EA`               Dividers, field
                                                  borders, card
                                                  boundaries

  `--color-gold`          `#9A7A2E`               Optional, sparing
                                                  highlight only if brand
                                                  review approves

  `--color-success`       `#236747`               Success states

  `--color-danger`        `#B42318`               Errors and destructive
                                                  actions
  -----------------------------------------------------------------------

These values are starting points, **not sampled pixel values or official
NSBE colours**. Check text/background contrast, especially for small
text, links, buttons, and muted labels. Do not recolour or redraw the
official NSBE logo to fit this palette. If official brand guidance
specifies different colours, official guidance takes precedence.

### 4.2 Typography scale (provisional)

Use a restrained type hierarchy rather than many unrelated sizes.

  Token                        Suggested desktop size Use
  ------------------ -------------------------------- ------------------------------------
  `--text-display`       `clamp(2.6rem, 5vw, 4.5rem)` Home hero headline
  `--text-h1`            `clamp(2.2rem, 4vw, 3.5rem)` Main page headings
  `--text-h2`          `clamp(1.7rem, 2.8vw, 2.4rem)` Section headings[cite: 1]
  `--text-h3`                        `1.25rem–1.5rem` Card and subsection headings[cite: 1]
  `--text-body`                       `1rem–1.125rem` Paragraphs[cite: 1]
  `--text-small`                           `0.875rem` Metadata, labels, supporting text[cite: 1]
  `--text-tiny`                             `0.75rem` Only nonessential compact metadata[cite: 1]

Use comfortable line height: approximately 1.1--1.2 for large display
headings and 1.5--1.7 for body copy[cite: 1]. Keep paragraph line lengths
readable; avoid full-width text blocks on large screens[cite: 1]. On mobile,
headings should wrap naturally rather than overflow or shrink to
unreadable sizes[cite: 1].

### 4.3 Layout and spacing (provisional)

-   Main content maximum width: approximately `1200px`, with flexible
    side gutters[cite: 1].
-   Desktop: use a 12-column grid where it helps; do not force every
    section into a grid[cite: 1].
-   Mobile gutters: approximately `20px`; increase to `28–40px` on
    larger screens as space permits[cite: 1].
-   Spacing scale: use a consistent set such as
    `4, 8, 12, 16, 24, 32, 48, 64, 96px`[cite: 1].
-   Section spacing: generous around major editorial sections, tighter
    within resource lists and forms[cite: 1].
-   Corners: usually `8–16px`; use larger radii only for selected
    imagery or a purposeful feature[cite: 1].
-   Borders: thin and quiet[cite: 1]. Use them to separate content or communicate
    interaction, not as decoration everywhere[cite: 1].
-   Shadows: subtle and rare[cite: 1]. Prefer spacing, typography, and borders to
    layers of shadow[cite: 1].
-   Use a clear alignment edge for headings, body copy, buttons, and
    cards within each section[cite: 1].

### 4.4 Shape, imagery, and decoration

-   Prefer real campus, engineering, event, and student-community
    photography over abstract stock visuals[cite: 1].
-   Give photographs a consistent treatment (crop, ratio, and corner
    style) within each content group[cite: 1].
-   Use overlays only when needed for readable text over photography[cite: 1].
-   Avoid gratuitous floating circles, blobs, gradients, glassmorphism,
    and decorative animations[cite: 1].
-   Icons should have a consistent visual style and meaningful purpose[cite: 1].
    Do not mix unrelated icon packs[cite: 1].
-   Keep visual decoration subordinate to the chapter's people,
    programs, events, and academic resources[cite: 1].

------------------------------------------------------------------------

## 5. Brand and content integrity

1.  Use the official NSBE logo and approved chapter marks supplied or
    approved by the chapter[cite: 1]. Do not recreate the logo with text or
    approximate it with a generic icon[cite: 1]. Do not redraw the official logo or modify its proportions.
2.  Confirm the chapter's preferred full name, logo variants, official
    colours, and any usage rules before launch[cite: 1].
3.  Use "NSBE Unilorin" consistently in the website header, footer, page titles, and metadata where appropriate, unless the chapter confirms a different formal naming convention[cite: 1].
4.  Do not invent membership counts, impact statistics, partner names,
    testimonials, event dates, leadership names, or claims about
    outcomes[cite: 1].
5.  The screenshots' "2025--2026" board year, program labels, partner
    logos, statistics, and copy are reference content---not approved
    Unilorin website content[cite: 1].
6.  Use clear, direct copy[cite: 1]. Explain what a student can do next; avoid
    generic slogans that could describe any organization[cite: 1].
7.  Label unavailable or upcoming features honestly[cite: 1]. Do not display a
    nonfunctional button as if it works[cite: 1].
8.  Confirm image consent and appropriate usage before publishing
    student photographs, especially identifiable portraits[cite: 1].

------------------------------------------------------------------------

## 6. Information architecture & Confirmed First-Release Scope

**Confirmed first-release pages and features:**

1. **Home** — introduce NSBE Unilorin, highlight important updates, upcoming events, programs, and academic resources.
2. **About** — explain the chapter's purpose, mission, and activities using approved information.
3. **Events** — display upcoming and relevant past chapter events.
4. **Programs** — present the chapter's initiatives, activities, and opportunities.
5. **Leadership** — show the current chapter executives and their approved profiles.
6. **Academic Hub** — provide a central place to browse approved academic resources across all 10 engineering departments (levels 100L, 200L, 300L, 400L, and 500L), organized by department, academic level, resource type (past questions, lecture materials, final-year project materials), and course or subject where appropriate.
7. **Past Questions** — let engineering students locate past questions by department and level.
8. **Final-Year Project Repository** — organize approved final-year project materials and related academic information.
9. **Contact / Join** — provide official contact channels and ways to express interest in the chapter (using mock values/placeholders during development; replace with verified details before launch).
10. **Tutorial Interest Form** — collect information from students interested in tutorials (Full name, email address, department, academic level, tutorial subjects/areas of interest, and optional phone number).
11. **Admin Dashboard** — allow authorized NSBE Unilorin executives to manage website content and academic resources without editing source code.
12. **Sponsors & Partners** — dedicated section using clearly labelled placeholder entries during development (do not invent sponsor names or display unapproved logos before confirmation).

Avoid adding every item to the top navigation[cite: 1]. A possible primary
navigation is **About, Events, Programs, Academic Hub**, with **Join
NSBE** as the visually distinct action[cite: 1]. On narrow screens, use an
accessible menu with a clear open/close state[cite: 1].

The academic hub may have its own local navigation or filter sidebar,
but should retain the site's logo, global navigation, type, and core
colour tokens[cite: 1].

------------------------------------------------------------------------

## 7. Page-by-page recommendations

### 7.1 Home

**Purpose:** Explain who the chapter is, what value it offers, and where
a student should go next[cite: 1].

Suggested order[cite: 1]:

1.  **Header:** official logo (NSBE Unilorin name consistently used), concise navigation, one primary action[cite: 1].
2.  **Hero:** a specific headline about the chapter's role at Unilorin,
    one short supporting paragraph, and a primary CTA to explore the
    Academic Hub or upcoming events[cite: 1]. Choose the main CTA based on the
    chapter's launch priority; do not give several buttons equal visual
    weight[cite: 1].
3.  **Useful destinations:** a small set of links to the Academic Hub,
    Events, Programs, and Get Involved[cite: 1]. These can be cards or simple
    editorial links; use the least decorative pattern that remains
    clear[cite: 1].
4.  **Chapter introduction:** short mission/overview and an authentic
    student or campus image[cite: 1].
5.  **Upcoming events:** show only verified upcoming events[cite: 1]. If there
    are none, show a helpful empty state rather than fake events[cite: 1].
6.  **Programs and initiatives:** selected real programs, using the
    photography-led approach seen in `Screenshot 2026-10-16 210849.png`[cite: 1]
    where suitable[cite: 1].
7.  **Academic Hub invitation:** explain what resources are available
    and how students can find them[cite: 1].
8.  **Leadership or community feature:** optional, using current
    approved content[cite: 1].
9.  **Sponsors & Partners section:** dedicated display with verified names/logos (or clear placeholders during development).
10. **Footer:** official name/logo, navigation, verified contact links,
    and any required attribution or policies[cite: 1].

Keep the first screen clear[cite: 1]. A student should understand the chapter's
identity and find the most important destination without scrolling
through a long promotional hero[cite: 1].

### 7.2 About

-   Use an editorial heading, concise mission statement, and
    plain-language chapter overview[cite: 1].
-   Explain the chapter's local role and activities using approved
    information[cite: 1].
-   Separate confirmed facts from future ambitions[cite: 1].
-   Use a real campus or member image only when available and approved[cite: 1].
-   End with a relevant next step such as joining, attending an event,
    or exploring resources[cite: 1].

### 7.3 Events

-   Prioritize event name, date, time, venue, organizer, and
    registration link[cite: 1].
-   Make upcoming and past events visually distinct[cite: 1].
-   Provide useful empty, loading, and error states[cite: 1].
-   Do not rely on colour alone to communicate event status[cite: 1].
-   Event cards should prioritize readable information over decorative
    photography[cite: 1].
-   If event details are incomplete, show only verified fields and
    communicate what is still to be confirmed[cite: 1].
-   Maintained by authorized NSBE Unilorin executives whenever new information becomes available or changes occur.

### 7.4 Programs and initiatives

-   Use a short page introduction followed by a small number of genuine
    programs[cite: 1].
-   The programs screenshot `Screenshot 2026-10-16 210849.png`[cite: 1] is a
    useful reference for category pills and varied photographic cards[cite: 1].
-   Use category filters only if the content set is large enough to
    justify them[cite: 1].
-   Every program item should have a title, brief description, and
    relevant action or detail page[cite: 1].
-   Avoid presenting generic categories as actual established programs
    until the chapter confirms them[cite: 1].

### 7.5 Leadership

-   Use current, verified names, titles, and term dates[cite: 1].
-   Use consistent portrait crops and image quality; include a group
    photograph if a suitable, approved image exists[cite: 1].
-   Keep names and roles readable and accessible; do not bake text into
    images[cite: 1].
-   A fine divider and warm neutral surface, as seen in
    `Screenshot 2026-10-16 211209.png`, can provide a calm editorial
    structure[cite: 1].
-   Do not reuse the reference screenshot's board year or implied roles
    without confirmation[cite: 1].

### 7.6 Academic Hub --- past questions and learning materials

This is a core utility, so prioritize finding a resource over visual
storytelling[cite: 1].

Recommended layout[cite: 1]:

1.  Page title and one-line explanation[cite: 1].
2.  Search field that accepts course codes, course names, topics, and
    resource titles where supported[cite: 1].
3.  Clear filters for the 10 engineering departments, levels (100L–500L), course, session/year if available, and resource type (past questions, lecture materials, final-year project materials). Use official department names once supplied; do not invent department names.
4.  Results count and current filter summary[cite: 1].
5.  A readable results list or compact cards showing title, course code,
    level, session/year (when known), resource type, and file format[cite: 1].
6.  A clear open/download action, permission note if needed, and an
    honest state when a file is unavailable[cite: 1].
7.  Empty state that suggests changing filters or requesting a resource[cite: 1].
8.  Mobile layout where filters collapse into an accessible panel and
    selected filters remain visible[cite: 1].

**Recommended interaction and permission rules:**

-   Filters should work together predictably and be easy to clear[cite: 1].
-   Preserve search/filter state when a user opens a resource and
    returns, where feasible[cite: 1].
-   Distinguish past questions, lecture notes, solutions, and other
    resource types using text labels---not colour alone[cite: 1].
-   **Permissions:** Only authorized NSBE Unilorin executives may upload, edit, replace, or remove academic resources. Students may browse and access published resources, but student uploads are not supported in the first release. Executives must verify materials before publication (checking relevance, accuracy, source, and suitability while respecting copyright and attribution requirements).
-   Never expose private uploads or restricted materials through public
    links accidentally[cite: 1].
-   If there is no confirmed content for a department/course, do not
    imply the library is complete[cite: 1].

### 7.7 Final-year project repository

Treat this as a curated knowledge resource, not an unstructured file
dump[cite: 1].

Potential metadata (confirm what the chapter can maintain)[cite: 1]: project
title, department, level/year, author or team (with permission),
supervisor (only if approved), project type, short abstract, keywords,
technology/methods, and approved document or repository link[cite: 1].

-   Provide search and filters appropriate to the available metadata[cite: 1].
-   Display the abstract or summary before the download/open action[cite: 1].
-   Make ownership, attribution, and permitted reuse clear[cite: 1].
-   Collect only information that is necessary and approved for
    publication[cite: 1].
-   Do not publish personal contact details, confidential reports, or
    unapproved student work[cite: 1].
-   Make it clear that project examples are for learning and
    inspiration, not a substitute for original work or academic
    integrity[cite: 1].

### 7.8 Tutorial interest form, privacy, and access control

-   **Agreed form fields:** Collect only Full name (required), Email address (required), Department (required), Academic level (required, from 100L to 500L), Tutorial subjects or areas of interest (required), and Phone number (optional). Do not add extra personal information fields without clear purpose and approval.
-   **Submission handling:** Store submissions securely using the project's Supabase architecture. Only authorized NSBE Unilorin executives should be able to view submitted responses. A student must not be able to retrieve another student's information by changing a URL, manipulating a request, or calling Supabase directly. Enforce using RLS policies and server-side authorization.
-   **Privacy information:** Before launch, provide a concise privacy notice explaining what information is collected, why it is collected, who can access responses, how it will be used to coordinate tutorial interest, how long submissions will be retained (with retention period and deletion procedure decided before launch), and how users can ask questions about their submitted information.
-   **Form experience:** Must work well on mobile devices, clearly identify required/optional fields, validate input with understandable error messages, provide a clear confirmation after successful submission, avoid exposing personal info in public pages/URLs/error messages, prevent duplicate submissions where practical, and avoid promising unconfirmed tutorial schedules, subjects, or tutor availability.

### 7.9 Contact / Join

-   State who the page is for and what happens after someone submits a
    form[cite: 1].
-   Use confirmed email, social links, or contact channels only (mock values and placeholder social links may be used during development for layout testing, but must be clearly identified as placeholders and replaced with verified official details before launch)[cite: 1].
-   Include field labels, validation messages, keyboard support, and a
    clear success/error state[cite: 1].
-   Avoid a vague "Submit" button when a more descriptive label is
    possible[cite: 1].

------------------------------------------------------------------------

## 8. Reusable component guidance

  -----------------------------------------------------------------------
  Component                           Recommended behaviour and visual
                                      treatment
  ----------------------------------- -----------------------------------
  Header / navigation                 Simple, consistent, responsive[cite: 1].
                                      Show active-page state; provide
                                      visible keyboard focus; ensure
                                      mobile menu is operable without a
                                      pointer[cite: 1].

  Primary button                      One main action style[cite: 1]. Strong
                                      contrast, clear verb, comfortable
                                      touch target, visible
                                      hover/focus/disabled states[cite: 1].

  Secondary link/button               Less prominent than the primary
                                      action; maintain clear contrast and
                                      predictable placement[cite: 1].

  Editorial section intro             Short heading and concise
                                      description; consistent alignment
                                      and spacing[cite: 1].

  Program/event card                  Use only where it improves
                                      scanning[cite: 1]. Prioritize title, date or
                                      category, short summary, and
                                      action[cite: 1].

  Resource row/card                   Metadata first, title clearly
                                      visible, one obvious open/download
                                      action, status or format text[cite: 1].

  Filter control                      Explicit label, keyboard support,
                                      visible selected state, clear/reset
                                      option[cite: 1].

  Search                              Persistent label or accessible
                                      name, clear affordance, useful
                                      empty state[cite: 1].

  Timeline/steps                      Numbered, ordered steps; use only
                                      for a genuinely sequential process[cite: 1].

  Partner logo grid                   Include only verified partners (or
                                      clearly labelled placeholders
                                      during development); keep logos
                                      secondary and preserve their
                                      proportions[cite: 1].

  Leadership profile                  Approved image, name, role, term
                                      where relevant; provide meaningful
                                      alt text when the image conveys
                                      information[cite: 1].

  Alert/status                        Text plus appropriate visual cue;
                                      announce important asynchronous
                                      status to assistive technology[cite: 1].

  Footer                              Consistent site navigation,
                                      verified links, identity, and
                                      relevant policy/contact
                                      information[cite: 1].
  -----------------------------------------------------------------------

Do not build a separate custom visual style for every section[cite: 1]. Shared
components should feel related through consistent typography, spacing,
border treatment, and interaction states[cite: 1].

------------------------------------------------------------------------

## 9. Responsive behaviour

Design mobile-first, then enhance for wider screens[cite: 1].

-   **Small mobile:** one-column content, readable text, full-width form
    controls where appropriate, no horizontal overflow, accessible menu,
    compact but not cramped spacing[cite: 1].
-   **Tablet:** use two-column layouts only when content remains
    readable; allow filter panels to collapse[cite: 1].
-   **Desktop:** use wider editorial compositions and multi-column
    resource results when they improve scanning; keep text widths
    controlled[cite: 1].
-   Hero images should crop intentionally at each breakpoint, keeping
    the subject visible[cite: 1].
-   Navigation, dialogs, dropdowns, and filter panels must work with
    keyboard and touch[cite: 1].
-   Test long course codes, long event titles, missing images, empty
    results, and large result counts[cite: 1].
-   Do not use hover as the only way to reveal important information[cite: 1].
-   Avoid layout shifts when images load; specify image dimensions or
    aspect ratios[cite: 1].
-   Respect reduced-motion preferences[cite: 1].

------------------------------------------------------------------------

## 10. Accessibility and usability requirements

Treat accessibility as a baseline requirement, not a later polish task[cite: 1].

-   Use semantic headings in order and landmarks for navigation, main
    content, and footer[cite: 1].
-   Ensure every form control has a programmatic label and helpful error
    text[cite: 1].
-   Provide visible focus indicators and full keyboard access[cite: 1].
-   Maintain adequate text and interface contrast; validate the final
    colour choices with a contrast checker[cite: 1].
-   Use meaningful link text rather than repeated "click here[cite: 1]."
-   Add useful alt text to informative images; use empty alt text for
    purely decorative imagery[cite: 1].
-   Do not rely on colour, icons, or position alone to convey meaning[cite: 1].
-   Make touch targets comfortably usable and spaced apart[cite: 1].
-   Support zoom and text resizing without clipped content[cite: 1].
-   Make loading, success, empty, and error states understandable[cite: 1].
-   Use reduced motion when requested and avoid motion that distracts
    from reading[cite: 1].
-   Test the resource hub with keyboard-only navigation and a screen
    reader where possible[cite: 1].

Target WCAG 2.2 AA as the implementation goal, subject to practical
testing[cite: 1].

------------------------------------------------------------------------

## 11. Motion and interaction

**Recommendation:** Keep motion quiet and purposeful[cite: 1].

-   Use short transitions for button states, menu opening, filter
    changes, and small reveals[cite: 1].
-   Avoid scroll-jacking, autoplaying background video, animated
    counters without verified data, and decorative motion that competes
    with content[cite: 1].
-   Do not delay access to core content for an entrance animation[cite: 1].
-   Use a reduced-motion alternative[cite: 1].
-   Keep focus and selection visible when content updates
    asynchronously[cite: 1].

The screenshots include decorative and rounded elements, but they do not
justify making motion a defining feature of the NSBE site[cite: 1].

------------------------------------------------------------------------

## 12. Content and photography checklist

Before launch, request or confirm[cite: 1]:

-   Official NSBE logo and chapter-approved variations (without redrawing or modifying proportions)[cite: 1].
-   Approved mission/overview copy[cite: 1].
-   Current executive names, roles, and term[cite: 1].
-   Real event information and registration links[cite: 1].
-   Confirmed program descriptions[cite: 1].
-   Authentic, approved campus and activity photos[cite: 1].
-   Verified partner/sponsor logos and permissions, if applicable (replacing dev placeholders)[cite: 1].
-   Academic resource categories, official department names, file permissions, and moderation rules[cite: 1].
-   Contact channels, social profiles, and privacy notice[cite: 1].

If any of these are missing, use a restrained placeholder in development
and clearly mark it as pending[cite: 1]. Do not silently replace it with invented
public-facing content[cite: 1].

------------------------------------------------------------------------

## 13. Performance, Backend, and Supabase Technical Implementation

-   Optimize photographs and use responsive image sizes where supported[cite: 1].
-   Reserve image space to avoid layout shift[cite: 1].
-   Avoid unnecessary dependencies for simple visual components[cite: 1].
-   Load only the font weights actually used[cite: 1].
-   Ensure the core site remains useful on slower connections and
    smaller devices[cite: 1].
-   Provide visible loading, empty, and failure states for events,
    resources, and forms[cite: 1].
-   Keep page titles, metadata, headings, and link labels meaningful[cite: 1].
-   Use descriptive URLs and make important public pages discoverable[cite: 1].

### Supabase Backend and Data Requirements
-   **Service Integration:** Use Supabase for required persistent application data and authentication according to the agreed application architecture[cite: 1].
-   **Data Areas:** Potential data areas include events, programs, leadership profiles, academic departments and levels, courses/subjects, academic resource metadata, final-year project entries, tutorial interest form submissions, sponsors and partners, and administrative user roles/permissions[cite: 1].
-   **Inspection & Reuse:** Inspect the existing Supabase project, database schema, authentication setup, and storage configuration before creating new tables or migrations[cite: 1]. Reuse existing structures when appropriate and avoid creating duplicate tables[cite: 1]. Do not assume tables, columns, buckets, or policies exist until verified[cite: 1].
-   **Executive-Only Management:** Only authorized NSBE Unilorin executives may create, update, or delete protected website content[cite: 1]. Enforce authorization using Supabase Row Level Security (RLS), Storage policies, and trusted server-side operations[cite: 1]. Test permissions across anonymous visitors, normal students/authenticated non-admins, and authorized executives (verifying both permitted and denied operations)[cite: 1].
-   **Academic File Storage:** Use Supabase Storage for past questions, lecture notes, and final-year project documents[cite: 1]. Publicly available materials may be readable by students without executive privileges; uploading, replacing, and deleting must remain restricted to authorized executives[cite: 1]. Materials requiring restricted access should use private storage and appropriate authorization[cite: 1]. Database records describing files must remain consistent with files[cite: 1]. Handle replacements/deletions carefully to avoid broken links or orphaned files[cite: 1]. Validate file types, sizes, and upload requirements[cite: 1].
-   **Supabase Secrets:** Never expose the Supabase service-role key or privileged secrets in browser-side code, frontend bundles, client-accessible configuration, or public repositories[cite: 1]. Use public project URL and publishable key for client-side integration, with access controlled by RLS and security policies[cite: 1]. Perform privileged operations only in trusted server-side environments[cite: 1].
-   **Development Practices:** Before implementing Supabase features, inspect project structure and configuration, review current tables/migrations/RLS/buckets, propose necessary changes before broad structural modifications, use migrations for database changes when matching workflow, test normal student access and executive-only operations, and avoid unrelated refactoring or unnecessary schema changes[cite: 1]. Use development/test data (placeholders) while building, ensuring they are not mistaken for real production records[cite: 1].

------------------------------------------------------------------------

## 14. Suggested design tokens

The following is an illustrative CSS token set, **not a claim about the
current codebase or official NSBE branding[cite: 1]**. Adjust it after checking
official assets and testing contrast[cite: 1].

``` css
:root {
  --color-ink: #171b24;
  --color-navy: #182d4d;
  --color-blue: #315fa8;
  --color-blue-dark: #244778;
  --color-page: #f7f7f4;
  --color-surface: #ffffff;
  --color-muted: #5f6876;
  --color-border: #e0e4ea;
  --color-gold: #9a7a2e;

  --font-display: "Source Serif 4", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  --content-width: 75rem;
  --page-gutter: clamp(1.25rem, 4vw, 2.5rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}