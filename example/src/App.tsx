import React from 'react'

import 'rlc-ts/dist/index.css'
import { Calendar } from 'rlc-ts'

const App = () => {
  return (
    <Calendar
      markedDays={(date) => {
        const backgroundColor = `#${Math.floor(
          Math.random() * 16777215
        ).toString(16)}`

        if (new Date(date).getDate() % 2 === 0) {
          return {
            marked: true,
            style: {
              backgroundColor
            }
          }
        }

        return
      }}
    />
  )
}

export default App
