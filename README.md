# MACQ NFT Marketplace

Modern NFT marketplace built with React + TypeScript + Vite featuring a unique design and seamless user experience.

## Features

- 🎨 Modern UI with gradient effects and animations
- 🖼️ Individual NFT pages with detailed views
- 💫 Interactive elements with smooth transitions
- 🤖 Integrated chatbot assistant
- 🔗 Blockchain integration with MetaMask for minting
- 📱 Responsive design for all devices

## Recent Updates

### UI/UX Improvements (May 2025)
- Enhanced button styling with modern gradients and animations
  - Improved Mint button visibility with stronger text shadows and gradient effects
  - Styled "Back to list" button with matching design
- Updated collection display to "Arte Eterno Collection #[ID]"
- Added responsive hover effects and animations
- Enhanced overall text visibility and contrast
- Improved mobile responsiveness

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Technical Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ThirdWeb SDK
- Web3 Integration
- MetaMask Support

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## AI Agent Changelog

**2025-05-19, 7:56:00 p. m. (America/Cancun, UTC-5:00):**
- **Implemented Two-Column Layout and Fixed DropCard Buttons:**
  - Implemented a two-column layout for the NFT cards using direct CSS in `src/App.css` to ensure consistent visibility.
  - Removed the non-functional "Flip Card" button from `src/components/DropCard.tsx`.
  - Restored the "Show Info" button in `src/components/DropCard.tsx` to toggle the display of the NFT description.
  - **Status:** Project is working correctly up to this point. ✅

**2025-05-19, 2:16:16 p. m. (America/Cancun, UTC-5:00):**
- **Implemented Two-Column Layout and Fixed DropCard Buttons:**
  - Implemented a two-column layout for the NFT cards using direct CSS in `src/App.css` to ensure consistent visibility.
  - Removed the non-functional "Flip Card" button from `src/components/DropCard.tsx`.
  - Restored the "Show Info" button in `src/components/DropCard.tsx` to toggle the display of the NFT description.
  - **Status:** Project is working correctly up to this point. ✅

**2025-05-19, 10:32:06 a. m. (America/Cancun, UTC-5:00):**
- **Pushed project to GitHub:** Successfully pushed all project files to the GitHub repository.

**2025-10-05:**
- **AI Chatbot Implemented:** Added an AI-powered chatbot to the marketplace.
  - **Features:**
    - Provides information about NFTs (descriptions, prices, how to buy) using local data.
    - Answers general questions and provides information about the "MUSEO DE ARTE CONTEMPORANEO DE QUINTANA ROO" using Google's Generative AI (Gemini 1.5 Flash model).
    - Features a pleasant conversational tone and a user-friendly interface.
    - Includes a visual typing indicator while fetching AI responses.
  - **Technical Details:**
    - Integrated the `@google/generative-ai` SDK.
    - Requires a `VITE_GOOGLE_AI_API_KEY` in the `.env` file to function with Google AI.
    - Chatbot UI styled to match the application's dark theme.
  - **Status:** Chatbot is functional and integrated into the application.

**2025-09-05:**
- **NFT Descriptions Fixed:** Successfully implemented dynamic fetching and display of NFT descriptions in the `DropCard` component. Descriptions are now visible on the marketplace cards. This is a good checkpoint; the application is rendering correctly with this feature.
- **Card Layout & Favicon:** Adjusted card layout for better desktop presentation (fixed 3-column grid). Full responsiveness for mobile/tablet column counts deferred. Favicon updated to use the primary "Unlockable Content Agency" logo.

**2025-05-19:**
- **Mobile Responsiveness & Styling Updates:** Implemented several updates to improve mobile viewing and refine styling.
  - **Features:**
    - Added mobile device detection script.
    - Changed "Marketplace Mobile" title to "Marketplace".
    - Added "MOBILE MODE" text indicator for mobile devices.
    - Slowed down the marquee animation.
    - Added a static version of the marquee text to the footer.
    - Implemented logo switching for mobile view.
    - NFT descriptions on cards are now hidden by default and revealed by clicking a smaller, styled "Show Info" button, which can be closed with a modern styled and responsive "X" button.
    - Styled the NFT description text.
    - Added an animated gradient to the footer text.
    - Made the chatbot toggle button more compact and round, using a larger animated robot icon from the header with enhanced modern styling.
    - Improved responsiveness of the chatbot input field.
  - **Status:** Mobile detection and styling updates are implemented.

**2025-10-05:**
- **AI Chatbot Implemented:** Added an AI-powered chatbot to the marketplace.
  - **Features:**
    - Provides information about NFTs (descriptions, prices, how to buy) using local data.
    - Answers general questions and provides information about the "MUSEO DE ARTE CONTEMPORANEO DE QUINTANA ROO" using Google's Generative AI (Gemini 1.5 Flash model).
    - Features a pleasant conversational tone and a user-friendly interface.
    - Includes a visual typing indicator while fetching AI responses.
  - **Technical Details:**
    - Integrated the `@google/generative-ai` SDK.
    - Requires a `VITE_GOOGLE_AI_API_KEY` in the `.env` file to function with Google AI.
    - Chatbot UI styled to match the application's dark theme.
  - **Status:** Chatbot is functional and integrated into the application.

**2025-09-05:**
- **NFT Descriptions Fixed:** Successfully implemented dynamic fetching and display of NFT descriptions in the `DropCard` component. Descriptions are now visible on the marketplace cards. This is a good checkpoint; the application is rendering correctly with this feature.
- **Card Layout & Favicon:** Adjusted card layout for better desktop presentation (fixed 3-column grid). Full responsiveness for mobile/tablet column counts deferred. Favicon updated to use the primary "Unlockable Content Agency" logo.

**2025-05-19:**
- **Mobile Responsiveness & Styling Updates:** Implemented several updates to improve mobile viewing and refine styling.
  - **Features:**
    - Added mobile device detection script.
    - Changed "Marketplace Mobile" title to "Marketplace".
    - Added "MOBILE MODE" text indicator for mobile devices.
    - Slowed down the marquee animation.
    - Added a static version of the marquee text to the footer.
    - Implemented logo switching for mobile view.
    - NFT descriptions on cards are now hidden by default and revealed by clicking a smaller, styled "Show Info" button, which can be closed with a modern styled and responsive "X" button.
    - Styled the NFT description text.
    - Added an animated gradient to the footer text.
    - Made the chatbot toggle button more compact and round, using a larger animated robot icon from the header with enhanced modern styling.
    - Improved responsiveness of the chatbot input field.
  - **Status:** Mobile detection and styling updates are implemented.
