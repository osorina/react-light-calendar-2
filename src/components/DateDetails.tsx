import * as React from 'react'
import { formartTime } from '../utils'
import times from 'lodash.times'
import tms from 'timestamp-utils'

type Props = {
    dayLabels: string[]
    monthLabels: string[]
    date: number
    displayTime?: boolean
    onTimeChange: (e: any) => void
}

const DateDetails: React.FC<Props> = ({
    date,
    displayTime,
    dayLabels,
    monthLabels,
    onTimeChange
}) => {
    const onHoursChange = (e: any) => {
        onTimeChange(tms.setHours(date, parseInt(e.target.value, 10)))
    }

    const onMinutesChange = (e: any) => {
        onTimeChange(tms.setMinutes(date, parseInt(e.target.value, 10)))
    }

    const hours = tms.getHours(date)
    const minutes = tms.getMinutes(date)

    return (
        <div className='rlc-date-details-wrapper'>
            <div className='rlc-date-details'>
                <div className='rlc-date-number'>{tms.getDay(date)}</div>
                <div className='rlc-date-day-month-year'>
                    <div className='rlc-detail-day'>
                        {dayLabels[tms.getWeekDay(date)]}
                    </div>
                    <div className='rlc-detail-month-year'>
                        {monthLabels[tms.getMonth(date) - 1]}{' '}
                        <span className='rlc-detail-year'>
                            {tms.getYear(date)}
                        </span>
                    </div>
                </div>
            </div>
            {displayTime && (
                <div className='rlc-date-time-selects'>
                    <select onChange={onHoursChange} value={hours}>
                        {times(24).map((hour: number) => (
                            <option value={formartTime(hour)} key={hour}>
                                {formartTime(hour)}
                            </option>
                        ))}
                    </select>
                    <span className='rlc-time-separator'>:</span>
                    <select onChange={onMinutesChange} value={minutes}>
                        {times(60).map((minute: any) => (
                            <option value={formartTime(minute)} key={minute}>
                                {formartTime(minute)}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}

export default DateDetails
