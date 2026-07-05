# Мої Докі / My Docs

An offline-first, Progressive Web App (PWA) designed as a secure archive and management system for your essential certificates, licenses, and IDs. It allows you to digitize your important documents, track their validity periods, and securely lock access behind a PIN.

## 🚀 Key Features

*   **Fully Offline Capable (PWA):** Built with Service Workers to ensure your data and application are always accessible without an active internet connection. All data stays strictly on your local device via IndexedDB.
*   **Validity Monitoring & Alerts:** Automatically tracks the status of your documents (Valid, Expiring, Expired, Permanent). An urgent alert marquee highlights documents that are nearing expiration or have already expired.
*   **Security & Privacy First:** Implements a customizable PIN lock system with auto-lock configurations to keep your private documents secure on shared devices.
*   **Bilingual Support:** Full, dynamic localization in both English and Ukrainian, including formatted dates and custom brandmarks (MR / МР).
*   **Document Management & Organization:**
    *   Add rich metadata to your documents: titles, identification numbers, issue dates, expiration dates, custom descriptions, and issuer information.
    *   Upload and store thumbnail images of your documents directly in the vault.
    *   Categorize documents easily with customizable colored tags.
    *   Archive older documents instead of deleting them entirely.
*   **Search, Filter & Sort:** Powerful search bar and filtering tools to rapidly find specific documents by their status, tags, or sort them by nearest expiration or name.
*   **Data Export & Backups:** 
    *   Safely backup your entire vault (documents, images, and settings) to a local JSON file, and restore it anytime.
    *   Export expiration dates directly to your calendar (`.ics` format) so you never miss a renewal deadline.
    *   Generate clean, printable reports of your active documents.
*   **Dynamic Theming:** Seamlessly toggle between Light and Dark mode interfaces.
*   **Hyper-Responsive Design:** Tailored CSS and Flexbox layouts guarantee a flawless user experience across ultra-wide desktop monitors, standard tablets, and extremely narrow mobile screens (down to 320px).

## 🛠️ Technology Stack

*   **HTML5 & CSS3:** Semantic markup with modern, highly responsive CSS variables and grid/flexbox layouts.
*   **Vanilla JavaScript (ES6+):** Pure, lightweight JavaScript for fast execution and DOM manipulation without heavy frameworks.
*   **IndexedDB:** For robust, scalable, and purely local storage of structured data and blobs (images).
*   **Service Workers:** For caching assets, enabling offline mode, and creating a genuine PWA experience.

## 📦 Installation & Usage

1.  **Run Locally:** You can run this project locally by serving the files via any standard HTTP server (e.g., VS Code Live Server, `python -m http.server`, `npx serve`, etc.). 
2.  **Install as App:** Open the URL in a supported browser (Chrome, Edge, Safari) and select "Install App" or "Add to Home Screen" to install it as a standalone application on your desktop or mobile device.
3.  **Start Adding Documents:** Set your secure PIN on first launch, tap "+ Add Document", and begin securely archiving your licenses and certificates!
