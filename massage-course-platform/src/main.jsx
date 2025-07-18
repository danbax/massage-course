import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import system from './lib/theme.js'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <HashRouter>
        <App />
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>
)