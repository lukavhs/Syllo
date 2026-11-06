# Handoff: Syllo v1 (tutoring-center management)

## Overview
Syllo is a multi-center tutoring management app with three roles: Admin, Assistant and Tutor. It replaces a WhatsApp + Excel workflow. This bundle holds 12 desktop screens for the v1 demo described in `Tutoring_Center_Development_Plan.md` and `CLAUDE.md` in the `lukavhs/tutoring-website` repo. Those docs own all business rules: pricing, permissions, month locking and time zones. This design only defines how those rules look.

## About the design files
`Syllo.dc.html` (plus `SylloSidebar.dc.html` and `support.js`) is a **design reference built in HTML**. Do not ship it as production code. Rebuild the screens in the repo's `web/` app with its own stack: React + Vite + TS, React Router, TanStack Query, Tailwind, FullCalendar and Recharts. To view it, open `Syllo.dc.html` in a browser; all three files must be in the same folder. Screens are laid out on a pan/zoom canvas, and each one is labelled `01`–`12`.

## Fidelity
**High fidelity.** Colors, type, radii, borders, shadows and copy are final. Match them closely using Tailwind tokens (config below). The mock data is illustrative only.

## Global layout
- Desktop artboard: 1440×900. The app should fill the viewport, with the sidebar fixed and the main area scrolling.
- **Sidebar**: 232px wide, bg `#90E0F3`, 2px right border `#0F2A3A`, padding 26/14/18. It contains:
  - Logo (see Brand), with the user's center name below it (12px, `#134A5E`).
  - Nav items: pills with 10/14 padding, 18px Lucide icon, 14px label, gap 12. Active item: bg `#FFF`, weight 700, shadow `0 0 0 2px #0F2A3A, 3px 3px 0 2px #0F2A3A`. Inactive: transparent, weight 500.
  - Count badge (Requests): pink `#FF6F9F` pill, 2px navy border, 12px bold.
  - User card pinned to the bottom: white, radius 20, 2px navy border, `3px 3px 0 #0F2A3A`. Shows avatar, name and role.
  - Admin nav: Dashboard, Requests, Students, Tutors, Assign student, Payments, Analytics, Settings.
  - Tutor nav: Dashboard, Calendar, Availability, My earnings.
- **Main area**: padding 36px 40px; vertical sections with gap 20–26.
  - Page title: Fredoka 500, 40px, line-height 1.1.
  - Optional eyebrow above the title (14px/600, `#3F5B69`).
  - Optional subtitle below the title (15px, `#3F5B69`).

## Visual language ("sticker" style)
- **Card**: bg `#FFFFFF`, radius 28 (24 for KPI tiles), border `2px solid #0F2A3A`, shadow `4px 4px 0 #0F2A3A`, padding 24.
- **Dark feature card** (revenue, pay totals, assign summary): bg `#0F2A3A`, text white, secondary text `#B5EBF8`/`#C5E3EE`, shadow `4px 4px 0 #FF6F9F`, no border.
- **Tinted panel** (secondary info): bg `#B5EBF8`, radius 28, 2px navy border, no shadow.
- **Primary button**: pill (radius 999), bg `#90E0F3`, text `#0C3A49` 700, 2px navy border, shadow `3px 3px 0 #0F2A3A`. On press: translate(2px,2px) and reduce the shadow to `1px 1px 0`.
- **Secondary button**: pill, white bg, 2px navy border, 600–700 weight, 14px.
- **Segmented tabs**: track bg `#B5EBF8`, radius 999, padding 5. Active segment: white, 700, shadow `0 0 0 2px #0F2A3A, 2px 2px 0 2px #0F2A3A`.
- **Tag/chip**: pill, padding 4–5/10–12, 12–13px 600–700.
- **All pills and buttons**: `white-space: nowrap; flex: none`.
- **Table rows**: 1px `#E8F4F8` dividers. Header: 12px 700 uppercase, `#3F5B69`, 1.5px `#C5E3EE` underline.
- **Icons**: Lucide (`lucide-react`), 14–18px.

## Status colors (used everywhere: chips, calendar blocks, payment cells, dots)
| Status | Background | Text | Dot / solid |
|---|---|---|---|
| Completed | `#C8F5D4` | `#155C32` | `#17894A` |
| No-show | `#FFD6D1` | `#A3271B` | `#F0533F` |
| Needs marking (past, unmarked) | `#FFE2BF` | `#8A4A00` | `#FF9A3C` |
| Change pending | `#FFF0A6` | `#6B5400` | `#F2C200` |
| Scheduled | `#EBE6FF` | `#2A2270` | `#8C7CF0` |
| Canceled | `#E8F4F8` | `#5F7C8A` (line-through) | `#9FCBDB` |

Chip anatomy: 7px dot + label. Calendar block: tinted bg, 5px left border in the dot color, radius 14. Unmarked blocks also get a `0 0 0 2px #FF9A3C` ring.

## Screens
1. **Admin dashboard**
   - Header: greeting with date eyebrow, plus "Open calendar" (secondary) and "Assign a student" (primary).
   - 4 KPI tiles: Today's lessons (lilac `#EBE6FF`/`#2A2270`), Pending requests (lemon), Not marked yet (peach), Revenue MTD (dark card, **admin only**).
   - Two-column grid (1.35fr / 1fr):
     - Left: today's lesson list. Each row: time 62px | 4px status bar | subject + tutor·students | status chip.
     - Right: Pending requests, with a quick-approve circle button in `#17894A`. Below it, "Not marked yet" with a "Mark" link.
2. **Change requests**
   - Tabs: Pending · n / Approved / Rejected / All history.
   - Request card: type tag (Reschedule = lemon, Cancel = coral), tutor, subject·students, age.
   - Old time chip (struck through) → new time chip (mint, or coral for a cancel), then a conflict-check line: green "Tutor and students are free" or coral "Clashes with …".
   - Reason quote, plus Reject (secondary) and Approve (`#17894A`, white text).
   - Right column (340px): "Recently decided" timeline.
3. **Assign a student / tutor search**
   - Left 300px card: new-student filters (subject, grade, school type, length, preferred time, day circles).
   - Right: tutor result cards with a match tag and slot pills (fits = mint; selected = navy fill; doesn't fit = dashed outline). The selected tutor card has a 2px navy border.
   - Sticky dark summary bar at the bottom: weekly time, start date, price rule (student price + tutor pay, admin only), and a "Create schedule" primary button.
4. **Students list + profile**
   - 340px list column: search field, rows with avatar, name/grade and a school-type outline tag. The selected row is white.
   - Profile header: 84px avatar, name, tags (grade, school type, time zone "Asia/Dubai · Cairo +2h"), "Edit profile".
   - 3 contact tiles.
   - Weekly lessons table: Day | Subject | Tutor | **Student-local time (bold)** | Cairo time | Length.
   - "Last 12 lessons" strip: 40px tall status blocks with icons.
5. **Payment table (admin)**
   - Tutor selector, plus month segmented control (Sep, Oct 🔒, Nov · live).
   - Locked banner (pill, `#B5EBF8`) with a "Reopen month" button (admin only).
   - Grid columns: student 180 | one 46px column per lesson date | Lessons 70 | Charged 110 | Tutor pay 110.
   - Cells are 32px squares, radius 10: completed = mint check, no-show = coral user-x, canceled = grey minus, no lesson = empty.
   - Total row, legend, "Export report".
   - Tutors see the same table with **only** the Tutor pay column ("My earnings").
6. **Analytics (admin)**
   - Dark revenue hero (EGP total, lessons, tutor pay, center margin).
   - Attendance stacked bar: completed / no-show / canceled %.
   - Revenue by subject: horizontal bars, 14px, fill `#FF9A3C` on `#E8F4F8`. Build with Recharts.
   - By-tutor table with an inline stacked attendance bar.
7. **Settings → Price rules (admin)**
   - Tabs: Subjects / Grades / Price rules / Assistants / Center.
   - Lemon "price missing" banner with an "Add this rule" button.
   - Filter chips, "New rule" button.
   - Table: Subject | Grade | School | Duration | Student price | Tutor pay | Center keeps.
8. **Tutor dashboard**
   - Title "Hi Omar, 2 lessons need marking".
   - Peach "Waiting to be marked" card with inline per-student Completed / No-show buttons.
   - "Coming up" list with Join Meet buttons.
   - Right column: My students, Lessons this week, a dark "My pay this month" card (own pay only, never student price), and My requests.
9. **Calendar (tutor, week)**
   - Header: date range, prev / Today / next, Week|Month toggle.
   - 7 day columns, Sat–Fri, with a 56px hour gutter.
   - 72px per hour, 13:00–21:00, and a now-line in `#F0533F`.
   - Today: column bg `#FFF4E6`, date in a `#90E0F3` circle.
   - Use FullCalendar `timeGridWeek`/`dayGridMonth` with custom event content matching the status block styles.
10. **Lesson detail + marking** (key interaction)
    - Breadcrumb, title "Math · Grade 10", meta chips (time Cairo, length, group size, recurrence).
    - Meet link pill with copy and "Join Meet".
    - "Who showed up?" card:
      - Progress bar (10px; fill `#17894A`; width animates `.35s cubic-bezier(.3,1.4,.5,1)`).
      - One row per student: avatar, name, school type · local time.
      - Each row has a segmented pair: **Completed** / **No-show**.
    - Right column: "Need to change it?" with Request reschedule and Request cancellation (both go to the approval queue), plus a "This series" status strip.
11. **My availability editor (tutor)**
    - Grid: 60px hour labels + 7 day columns × hourly rows 13:00–21:00, 54px cells, radius 14, gap 6.
    - Cell states:
      - Free (painted): `#A6ECBD` + check.
      - Booked: `#17703C` + lock + "Lesson", not editable.
      - Unavailable: 1.5px dashed `#C5E3EE`.
    - Click or drag to paint free hours.
    - Side panel: "Free for new students: N h / week" (mint), legend, and a Save button.
12. **Register a center / sign in**
    - Split layout.
      - Left: `#90E0F3` panel with decorative circles (`#5CC6E2`, `#FF9ECB`, `#E3F6FC`), logo, and the headline "Every lesson marked. Every payment counted." (Fredoka, 60px).
      - Right (600px): tab toggle Sign in / Register a center, then fields: center name, your name, email, phone, password. Fields are pill inputs; the focused field gets a `#90E0F3` border. Primary "Create center" button.
    - Whoever registers becomes the center's admin.

## Interactions & behavior
- **Marking (screen 10, also inline on 8 and 1)**:
  - Clicking Completed or No-show sets that student's attendance. Clicking the active option again clears it.
  - Completed: row bg `#EAFCEF`, border `#A6ECBD`, avatar turns into a `#17894A` circle with ✓, meta becomes "Marked completed · just now", and a `+ EGP {tutorPay}` pill appears.
  - No-show: row `#FFF0EE`/`#FFB8AE`, avatar `#F0533F` with ✕, meta "Marked no-show · not billed".
  - The active button gets a solid fill (green or coral, white text). Buttons scale to .94 on press, and all color changes transition over 200–250ms.
  - The summary text and progress bar update live, e.g. "2 of 3 marked · EGP 220 so far" or "All marked · EGP 440 added to your pay".
  - Use an optimistic mutation (TanStack Query) and snapshot prices on Completed, as `CLAUDE.md` requires.
- Change requests: the tutor submits → it appears in the Pending queue → Approve or Reject moves it to history. Show the conflict check before approval.
- Locked months are read-only. Admins see "Reopen month"; assistants and tutors don't.
- **Role gating**: never render prices, revenue or analytics to assistants or tutors. Tutors see only their own pay.
- Hover states: pills and buttons darken one step (`#5CC6E2` on primary; `#E3F6FC` on secondary). Keyboard focus: `outline: 2px solid #0F2A3A; outline-offset: 2px`.

## Design tokens
Colors:
- Canvas/page `#E3F6FC`, deeper page `#BFE9F7`, surface/tinted `#B5EBF8`, brand `#90E0F3`, brand-deep `#5CC6E2`, card `#FFFFFF`.
- Ink `#0F2A3A`, ink-on-brand `#0C3A49`, text-2 `#24404E`, text-muted `#3F5B69`, text-faint `#5F7C8A`.
- Divider `#E8F4F8`, border-soft `#C5E3EE`, border-mid `#9FCBDB`.
- Accent pink `#FF6F9F` (badges, dark-card shadow), lilac `#8C7CF0`.
- Avatars rotate through `#3AA8D8 #8C7CF0 #FF6F9F #FF9A3C #20A35A #E0A800 #5B6CF0 #F0533F`.

Status colors: see the status table above.

Typography:
- Headings: **Fredoka 500**. Body: **Nunito 400/600/700**. Both from Google Fonts.
- Sizes: page title 40, section title 22, hero numbers 36–54, body 15, small 13–14, micro 12.

Radii: 10 (cells), 14 (calendar blocks / availability cells), 20–24 (tiles), 28 (cards), 999 (pills).

Spacing: 4 / 8 / 12 / 16 / 20 / 24 / 28 / 36 / 40.

Shadows:
- Card: `4px 4px 0 #0F2A3A`.
- Button: `3px 3px 0 #0F2A3A`.
- Dark card: `4px 4px 0 #FF6F9F`.
- Borders: always `2px solid #0F2A3A` on elevated elements.

Suggested Tailwind theme extension: put the colors above under `colors.syllo.*`, set `fontFamily.display = ['Fredoka']` and `fontFamily.sans = ['Nunito']`, set `boxShadow.sticker = '4px 4px 0 #0F2A3A'` and `boxShadow['sticker-sm'] = '3px 3px 0 #0F2A3A'`, and set `borderRadius.card = '28px'`.

## Brand
- **Logo (Tick-o)**: lowercase "syll" in Fredoka 600 (letter-spacing -0.02em, color `#0F2A3A`), followed by a circle replacing the "o".
  - The circle is white with a 3px navy border, containing a Lucide `check`. Its diameter is about 0.85× the font size, nudged down so it sits on the x-height.
  - Sizes: sidebar 30px, sign-up 34px.
  - App icon: `#90E0F3` rounded square holding the white check circle.
- Reference: `Syllo Brand Explorations.dc.html` in the design project, option 2a.

## Assets
- Icons: Lucide (`lucide-react`).
- Fonts: Google Fonts Fredoka and Nunito.
- No raster images.

## Files
- `Syllo.dc.html`: all 12 screens on one canvas (mock data and marking logic are in its script block).
- `SylloSidebar.dc.html`: the sidebar, with role (`admin` | `tutor`) and active-item props.
- `support.js`: runtime needed to open the HTML files locally.
- `screenshots/01…12-*.png`: 1440×900 captures of each screen, numbered to match the Screens list above.
