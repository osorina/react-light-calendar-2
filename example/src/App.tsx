import React, { useState } from 'react'
// @ts-ignores
import tms from 'timestamp-utils'
import { Calendar } from 'rlc-typescript'

import 'rlc-typescript/dist/index.css'

const App = () => {
    const [startDate, setSD] = useState(Date.now())

    return (
        <Calendar
            onClickDate={setSD}
            startDate={startDate}
            markedDays={[
                {
                    date: tms.addDays(Date.now(), -5),
                    style: {
                        background: 'red'
                    }
                }
            ]}
        />
    )
}

export default App
