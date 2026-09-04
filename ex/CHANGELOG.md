# Changelog

## [1.9.7] - 2026-04-04

### Fixed
- Currency grid now renders immediately instead of waiting for a network rate fetch
- App now loads the last saved rates from local storage on startup and uses them offline before attempting an online refresh
- Offline transition now refreshes the UI from locally saved rates so conversions remain available

## [1.9.6] - 2026-04-04

### Fixed
- Fixed offline app-shell loading by making service-worker cache matching work with versioned asset URLs
- Switched PWA manifest scope and start URL to relative paths so installs work correctly across deployment paths

## [1.9.5] - 2026-04-04

### Changed
- Added spacing below the selected-currency indicator so it is not cramped against the input

## [1.9.4] - 2026-04-04

### Changed
- Simplified the selected-currency indicator to plain text without the pill style

## [1.9.3] - 2026-04-04

### Added
- Visible selected-currency indicator in the calculator section, for example `EUR -> RSD`

## [1.9.2] - 2026-04-04

### Changed
- Kept the History button aligned to the right of the section title on mobile

## [1.9.1] - 2026-04-04

### Changed
- Centered the chevron icon inside the rates toggle button

## [1.9.0] - 2026-04-04

### Added
- Persistent calculator state in local storage for selected currencies, amount, result text, and rates-panel visibility
- Exchange-rate cache now uses dedicated storage keys and also persists fallback rates for offline reuse

### Changed
- Updated cache/version identifiers for the new persisted app state behavior

## [1.8.5] - 2026-04-04

### Fixed
- Fixed history confirmation modal showing immediately on page load

## [1.8.4] - 2026-04-04

### Changed
- Removed the redundant History subheading from the history page

## [1.8.3] - 2026-04-04

### Changed
- Replaced the system clear-history confirmation with a custom in-app modal

## [1.8.2] - 2026-04-04

### Changed
- History page actions moved to the top row and language picker removed
- History page now always follows the language selected on the main calculator page

## [1.8.1] - 2026-04-04

### Added
- History entries are now grouped by day with Today and Yesterday labels
- Individual delete action for each saved calculation on the history page

## [1.8.0] - 2026-04-04

### Added
- Calculation history page with local history storage and clear-history action
- History shortcut in the main calculator section for quick access to saved conversions
- Persistent language preference shared between the calculator and history page

### Changed
- Updated translations and cache/version identifiers for the new history flow

## [1.7.0] - 2026-02-03

### Added
- **Dynamic Currency Selection**: Replaced static conversion sections with a dynamic currency grid. Users can now select a source and target currency for conversion.
- **State-Driven UI**: Implemented a state machine to manage the selected currencies and the visibility of the calculator.
- **Unified Conversion Logic**: Refactored the conversion logic into a single, reusable function that handles all currency pairs.
- **Responsive UI Feedback**: Added visual feedback for selected currencies and a responsive layout for the new components.
- **Input Validation**: Added input validation to ensure that only positive numbers are used for conversions.

### Changed
- **UI/UX Overhaul**: The main conversion interface has been redesigned to be more intuitive and flexible.
- **Code Simplification**: Removed over 20 redundant conversion functions and their corresponding event listeners.
- **Version Bump**: Updated the app version to 1.7.0 in all relevant files.

### Technical Details
- **DOM Manipulation**: The currency grid and calculator are now dynamically rendered and controlled via JavaScript.
- **State Management**: Simple state variables (`fromCurrency`, `toCurrency`) are used to track the user's selection.
- **CSS**: Added new styles for the currency grid, calculator, and responsive adjustments.

## [1.6.0] - 2026-02-03

### Added
- Tablet (768–1024px) and desktop (1024px+) responsive layouts
- Touch-friendly controls with 44px targets and improved focus states
- Keyboard Enter support on inputs for default conversions
- Apple touch icon and theme-color meta for app-like navigation

### Changed
- Moved Poppins font loading to HTML with preconnect for performance
- Enhanced service worker to cache Google Fonts (stale-while-revalidate)
- Updated cache/version identifiers to 1.6.0
- Improved accessibility via ARIA labels and aria-live updates

### Technical Details
- Mobile-first CSS with explicit tablet/desktop breakpoints
- Added `keydown` handlers on inputs to trigger conversions
- Service worker: network-first for API, cache-first for static, SWR for fonts
- Manifest/version query params updated across HTML/JS/SW

## [1.5.0] - 2025-12-27

### Added
- Offline UI caching with service worker implementation
- Full offline functionality for the entire app interface
- Service worker registration with automatic cache management
- Cache versioning tied to app version for proper updates

### Changed
- Updated version to 1.5.0 across all files
- Enhanced offline experience to include UI persistence without internet connection

### Technical Details
- Implemented service worker (sw.js) with cache-first strategy for static assets
- Added network-first strategy for exchange rate API calls
- Integrated service worker registration in app.js with update handling
- Cached essential assets: HTML, CSS, JS, images, translations, and manifest

## [1.4.1] - 2025-12-23

### Fixed
- Offline functionality improved to properly cache exchange rates when online
- Fixed offline status notifications to show specific timestamps for cached data
- Enhanced error handling for network failures with proper fallback to cached rates

## [1.4.0] - 2025-12-23

### Added
- Polish Zloty (PLN) currency support
- Added PLN conversion functionality for all existing currencies (EUR, RSD, CZK, HUF, MKD)
- Updated translations for English, Slovak, and Serbian languages
- Added PLN fallback exchange rate for offline functionality

### Changed
- Updated version numbers across all files (manifest.json, app.js, index.html)
- Enhanced exchange rate display to include PLN

### Technical Details
- Added 24 new conversion functions for PLN-to-other-currency conversions
- Updated fallback rates object with PLN: 4.25
- Extended translation files with PLN placeholders
- Added PLN section to HTML interface with full conversion capabilities

## [1.3.0] - 2024-12-XX

### Added
- MKD fixes + Enhanced offline functionality with fallback rates

## [1.2.0] - 2024-XX-XX

### Added
- Previous version features

## [1.1.0] - 2024-XX-XX

### Added
- Initial release features
