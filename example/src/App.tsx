import React from 'react'

import 'rlc-typescript/dist/index.css'
import { Calendar } from 'rlc-typescript'

const App = () => {
    return <Calendar startDate={new Date().getTime()} displayTime />
}

export default App
