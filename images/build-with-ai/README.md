# Build-with-AI screenshots

Captured 2026-09-08 using the existing application UI rendered locally with example data. These are full viewport captures at 1280 by 800 CSS pixels, without cropping. They are not authenticated production captures. Gold outlines mark the controls described in the guide.

All portal screenshots render the original JSX from `lsv2_api_v3_portal/app/dashboard/layout.tsx`, including the complete sidebar, logo, breadcrumb, environment selector, account header, and content area. Authentication and data are supplied locally; the example account is Alex, alex@example.com.

- `request-live-access.png`: original `StatusPanel` and `StatusCard` from `app/dashboard/page.tsx`, with Live status NONE. Overview is selected in the sidebar. The Live selector and Request access button are highlighted.
- `api-keys-menu.png`: original `app/dashboard/api-keys/page.tsx` layout and `ApiKeysClient`, with an empty key list and Live selected. API keys is highlighted under Build in the sidebar. Recaptured 2026-10-08 when the page dropped its own Environment menu, at the same size and with the same example account, using the page's own components and the portal's CSS inside a local copy of the dashboard layout.
- `create-live-key.png`: the same full API keys screen, highlighting the Live selector at the top right and the Create Live key button. No key was created. Recaptured 2026-10-08: the page now creates keys for the environment selected at the top right, so there is no Environment menu to set.
- `find-your-bank.png`: full `lsv2_api_v3/src/main/resources/pages/connect-session.html` page, using a local example configuration and institution-search response showing Chase. No bank connection was created.

Portal captures use the portal's compiled CSS and original navigation components. Routing, authentication, and account/search data are supplied by the local capture harness. No real account identifiers, API credentials, or bank credentials appear in these images.