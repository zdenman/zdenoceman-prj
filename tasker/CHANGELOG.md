# Changelog

## [1.2.7] - 2026-02-07

### fix
- Added native touch drag-and-drop support for reordering lists and tasks on touch screen devices (tablets, phones). Uses `touchstart`/`touchmove`/`touchend` events with visual clone feedback, no external dependencies.
- Fixed clone positioning offset calculation so touch drag-and-drop correctly detects drop targets under the finger.

## [1.2.6] - 2026-02-07

### fix
h no complicated sc- Switched column view from CSS `columns` (vertical fill) to CSS Grid with `align-items: start` so lists flow horizontally (row-by-row, left-to-right) instead of vertically (top-to-bottom per column). Each list card sizes independently without stretching to match row neighbors.
- Added 3-column breakpoint at 1920px for better intermediate screen support (previously jumped from 2 columns directly to 4 at 2560px).

## [1.2.5] - 2026-02-07

### fix
- Changed task meta display order to: date → time → countdown timer (previously time → date → countdown).

## [1.2.4] - 2026-02-07

### fix
- Switched column-view layout from CSS Grid to CSS columns (masonry-style) so lists stack tightly without large row gaps between items of different heights.

## [1.2.3] - 2026-02-07

### fix
- Fixed broken list header HTML structure: closing `</div>` was missing, causing title/controls to shift when list was expanded.
- Body now uses 95% width on screens 1920px+ for better use of available space.

## [1.2.2] - 2026-02-07

### feature
- Added live countdown timer on lists with date and time set, matching task-level countdown behavior with urgency color coding.
- 4-column grid layout on 4K screens (2560px+) with body max-width increased to 2400px for proper use of screen real estate.

### fix
- Reduced gap between collapsed lists for tighter, more even stacking in both row and column views.
- Removed hover translateY on list cards to prevent layout jitter when stacked.
- List header now has consistent min-height (48px) so all collapsed cards are uniform size.
- List date display uses flexbox alignment for proper vertical centering alongside the title.

## [1.2.1] - 2026-02-07

### feature
- Added due time support for lists, matching task-level time capability. Time is configurable in both Create and Edit list modals.
- Column view now uses a fixed 2-column grid on Full HD screens and 4-column grid on 4K screens (2560px+).

### fix
- Removed unneeded gap between collapsed lists by removing border-bottom on collapsed list headers.
- Lists without a date no longer display "No date" label.
- Moved list date (and time) display inline with the list title in the header row, vertically centered to match task layout.
- Collapsed lists now have uniform height for clean, even stacking.
- List description is now hidden when collapsed and shown below the header when expanded.

## [1.1.5] - 2026-02-07

### fix
- Changed bullet list markers from hollow circles to filled discs with regular text-colored markers.
- Added markup support for ordered lists (`1. item`, `2. item`, etc.) rendered as `<ol>`.
- Added markup support for `## heading` (h2) and `### heading` (h3) in task body content.
- Added markup support for URL links: `[text](url)` syntax and auto-linked plain `https://` URLs.
- Added markup support for horizontal line dividers using `---`, `***`, or `___`.
- Prevented link clicks inside task body from toggling expand/collapse behavior.

## [1.1.4] - 2026-02-07

### fix
- Fixed mobile layout issue where time, date, and countdown timer elements shifted down when a task body was expanded, overlapping with editing or text body content.
- Grouped time, date, and countdown into a `.task-meta` container so they stay together and remain pinned to the top of the task row regardless of body expansion.
- Changed task item alignment from `center` to `flex-start` so metadata and action elements stay at their original position when tasks are expanded.

## [1.1.2] - 2026-02-06

### feature
- Added compact list stats visible in collapsed lists: total tasks, finished tasks, timed tasks, and urgent tasks.
- Added collapsible **Finished tasks** section per list with live item count in the section header.

### fix
- Updated app version references to `1.1.2` in runtime constant, package metadata, lockfile metadata, and footer version display.

## [1.1.1] - 2026-02-06

### fix
- Reworked light theme color system with dedicated surface/background tokens so the UI no longer appears as flat white blocks.
- Added richer light-theme visual depth (gradient app background, elevated header shell, refined borders/shadows, and consistent hover states) to match dark-theme polish.
- Updated app version references to `1.1.1` in runtime constant, package metadata, lockfile metadata, and footer version display.

## [1.1.0] - 2026-02-06

### feature
- Added structured task rendering where the first line is treated as the task title and remaining lines are treated as collapsible body content.
- Added click-to-toggle expand/collapse behavior on task content area for tasks with body text, with persistent open/closed state saved in task data.
- Added formatted body rendering with lightweight markup support (paragraphs, bullet lines, bold, italic, inline code).
- Added inline task body editing on double click: opens an expanding textarea directly under the task, auto-resizes while typing, and saves/collapses when clicking the task header/content area.

### fix
- Improved task text safety and fallback handling for older/edge-case task content values during rendering.
- Updated app version references to `1.1.0` in runtime constant, package metadata, lockfile metadata, and footer display.
- Kept full task edit modal behavior behind the 3-dots task menu Edit action instead of double-click.

## [1.0.5] - 2026-02-06

### feature
- Added automatic prioritization for active timed tasks due within 1 hour so they are shown above non-timed tasks.
- Added urgency ordering for prioritized timed tasks so the task with the least remaining time is shown first.

### fix
- Added live threshold handling so tasks are re-rendered into or out of the priority section when crossing the 1-hour boundary.

## [1.0.4] - 2026-02-06

### feature
- Added subtle row-level urgency highlighting for timed tasks: yellow outline/background at 20 minutes and red outline/background at 10 minutes.
- Kept completed timed tasks clean by hiding countdown output while still showing configured time/date metadata.

### fix
- Prevented completed tasks from receiving live urgency row highlighting updates.
- Adjusted finished-row layout so the Finished badge sits consistently at the end of the row, aligned with other completed items.

## [1.0.3] - 2026-02-06

### feature
- Added timed-task urgency colors: countdown turns **yellow** when 20 minutes or less remain, and **red** when 10 minutes or less remain.
- Added live **mm:ss** countdown rendering during the final 5 minutes before due time.

### fix
- Updated countdown refresh cadence from 60 seconds to 1 second to keep final-minute timing accurate.
- Kept overdue `Due!` visibility while stopping blinking animation when an overdue task is marked as done.

## [1.0.2] - 2026-02-06

### feature
- Added a new **Localisation** tab in Settings with configurable **Date Format** (YYYY-MM-DD, DD.MM.YYYY, MM/DD/YYYY) and **Time Format** (24h, 12h).
- Added persistent app settings storage via `plannerSettings` so localization preferences are saved and restored.
- Updated all visible date/time outputs in list cards and task chips to respect selected localization formats.
- Included localization preferences in export/import JSON data flow for full settings portability.

## [1.0.1] - 2026-02-06

### fix
- Restored completed-task behavior so checked tasks are rendered at the bottom of each list.
- Restored clear completed-state visuals with line-through text and a visible Finished marker.
- Added a lightweight footer at the bottom of the app that displays the current version.
- Updated app version references to `1.0.1` in UI and package metadata.
