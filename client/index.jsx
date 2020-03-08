import React from 'react'
import { render } from 'react-dom'

import App from './App'

const { basePath } = window

render(<App basePath={basePath} />, document.getElementById('root'))
