import './css/tailwind.css'
import './css/prose.css'
import './css/main.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as UrqlProvider } from 'urql'
import { createUrqlClient } from './lib/urql-client'
import { App } from './components/App'

const urqlClient = createUrqlClient()

ReactDOM.render(
  <UrqlProvider value={urqlClient}>
    <Router>
      <App />
    </Router>
  </UrqlProvider>,
  document.getElementById('app'),
)
