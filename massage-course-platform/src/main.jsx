
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import system from './lib/theme';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import ReactGA from 'react-ga4';
ReactGA.initialize('G-ZSV6D1V58S', { gaOptions: { siteSpeedSampleRate: 1 } });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <HashRouter>
        <App />
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>
)