import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    width: 100%;
    min-height: 100vh;
    background-color: #080C15;
    background-image: 
      radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 50%);
    background-attachment: fixed;
    color: #F8FAFC;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    color: #F8FAFC;
    letter-spacing: -0.025em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    color: inherit;
  }

  ::selection {
    background: rgba(99, 102, 241, 0.6);
    color: #ffffff;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(8, 12, 21, 0.8);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;
