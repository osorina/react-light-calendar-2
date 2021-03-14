import * as React from 'react'
import tms from 'timestamp-utils'
import {
  initMonth,
  parseRange,
  getDays,
  dateIsBetween,
  dateIsOut,
  getDateWithoutTime
} from './utils'

import { labels } from './labels'

// Components
import DateDetails from './components/DateDetails'
import Navigation from './components/Navigation'

const noop = () => null

type Props = {
  timezone?: string
  startDate?: number
  endDate?: number
  disableDates?: (date: number) => boolean
  markedDays?: (
    d: number
  ) => void | boolean | { marked: boolean; style?: React.CSSProperties }
  displayTime?: boolean
  dayLabels?: string[]
  monthLabels?: string[]
  onClickDate?: (date: number) => void
}

export const Calendar: React.FC<Props> = ({
  startDate,
  endDate,
  timezone = 'UTC',
  disableDates = noop,
  markedDays,
  displayTime,
  dayLabels = labels.dayLabels,
  monthLabels = labels.monthLabels,
  onClickDate = noop
}) => {
  const [initMonthState, setInitMonthState] = React.useState<
    ReturnType<typeof initMonth>
  >({} as any)
  const [parseRangeState, setParseRangeState] = React.useState<
    ReturnType<typeof parseRange>
  >({} as any)

  React.useEffect(() => {
    console.log('useEffect timezone')

    tms.setTimezone(timezone)
  }, [timezone])

  React.useEffect(() => {
    console.log('useEffect startDate, endDate')
    setInitMonthState(initMonth(startDate))
    setParseRangeState(parseRange(startDate, endDate))
  }, [startDate, endDate])

  const onClickDay = (day: number) => {
    const { startDate, endDate } = parseRangeState

    if (!startDate) {
      setParseRangeState({ startDate: day, endDate })
    } else if (startDate && !endDate) {
      setParseRangeState(parseRange(startDate, day))
    } else {
      setParseRangeState({ startDate: day, endDate: null })
    }
  }

  const changeMonth = ({ yearOffset = 0, monthOffset = 0 }) => {
    const { firstMonthDay } = initMonthState

    const timestamp = tms.add(firstMonthDay, {
      months: monthOffset,
      years: yearOffset
    })

    setInitMonthState(initMonth(timestamp))
  }

  const classnameAndStyle = (day: number) => {
    const { startDate, endDate } = parseRangeState
    const { firstMonthDay, lastMonthDay } = initMonthState

    const sDate = startDate && getDateWithoutTime(startDate)
    const eDate = endDate && getDateWithoutTime(endDate)
    const marked = markedDays?.(day)

    const conditions = {
      'rlc-day': true,
      'rlc-day-disabled': disableDates(day),
      'rlc-day-today': day === getDateWithoutTime(new Date().getTime()),
      'rlc-day-inside-selection': dateIsBetween(day, sDate, eDate),
      'rlc-day-out-of-month': dateIsOut(day, firstMonthDay, lastMonthDay),
      'rlc-day-selected': !endDate && sDate === day,
      'rlc-day-start-selection': endDate && sDate === day,
      'rlc-day-end-selection': endDate && eDate === day,
      'rlc-day-marked': typeof marked === 'object' ? marked.marked : marked
    }

    return {
      style: { ...(typeof marked === 'object' && { ...marked.style }) },
      className: Object.entries(conditions).reduce(
        (prev, [className, valid]) => (valid ? `${prev} ${className}` : prev),
        ''
      )
    }
  }

  return (
    <div className='rlc-calendar'>
      <div className='rlc-details'>
        {!!parseRangeState.startDate && (
          <DateDetails
            dayLabels={dayLabels}
            monthLabels={monthLabels}
            date={parseRangeState.startDate}
            displayTime={displayTime}
            onTimeChange={(date: number) =>
              setParseRangeState(({ endDate }) => ({
                endDate,
                startDate: date
              }))
            }
          />
        )}
        {!!parseRangeState.endDate && (
          <DateDetails
            dayLabels={dayLabels}
            monthLabels={monthLabels}
            date={parseRangeState.endDate}
            displayTime={displayTime}
            onTimeChange={(date: number) =>
              setParseRangeState(({ startDate }) => ({
                startDate,
                endDate: date
              }))
            }
          />
        )}
      </div>
      <Navigation
        monthLabels={monthLabels}
        month={initMonthState.month}
        year={initMonthState.year}
        onChange={changeMonth}
      />
      <div className='rlc-days-label'>
        {dayLabels.map((label: string) => (
          <div className='rlc-day-label' key={label.toLowerCase()}>
            {label.slice(0, 2)}
          </div>
        ))}
      </div>
      <div className='rlc-days'>
        {getDays(
          initMonthState.firstDayToDisplay,
          initMonthState.lastMonthDay
        ).map((day: number) => (
          <div
            {...classnameAndStyle(day)}
            key={day}
            onClick={() => {
              onClickDate(day)
              !disableDates(day) && onClickDay(day)
            }}
          >
            {parseInt(tms.getDay(day), 10)}
          </div>
        ))}
      </div>
    </div>
  )
}
