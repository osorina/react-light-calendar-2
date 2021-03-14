import * as React from 'react'
import tms from 'timestamp-utils'
import {
    initMonth,
    parseRange,
    getDays,
    dateIsBetween,
    dateIsOut,
    getDateWithoutTime,
    isSame
} from './utils'

import { labels } from './labels'

// Components
import DateDetails from './components/DateDetails'
import Navigation from './components/Navigation'

export type MarkedDay = { date: number; style?: React.CSSProperties }
export type DateRangeType = ReturnType<typeof parseRange>

type Props = {
    timezone?: string
    startDate?: number
    endDate?: number
    displayTime?: boolean
    dayLabels?: string[]
    monthLabels?: string[]
    markedDays?: MarkedDay[]
    yearNavigation?: boolean
    disableDates?: (date: number) => boolean
    onClickDate?: (date: number) => void
    onChange?: (params: DateRangeType) => void
}

export const Calendar: React.FC<Props> = ({
    startDate,
    endDate,
    timezone = 'UTC',
    displayTime,
    dayLabels = labels.dayLabels,
    monthLabels = labels.monthLabels,
    markedDays,
    yearNavigation,
    disableDates,
    onClickDate,
    onChange
}) => {
    const [initMonthState, setInitMonthState] = React.useState<
        ReturnType<typeof initMonth>
    >({} as any)
    const [parseRangeState, setParseRangeState] = React.useState<DateRangeType>(
        {} as any
    )

    React.useEffect(() => {
        tms.setTimezone(timezone)
    }, [timezone])

    React.useEffect(() => {
        setInitMonthState(initMonth(startDate))
        setParseRangeState(parseRange(startDate, endDate))
    }, [startDate, endDate])

    const onClickDay = (day: number) => {
        const { startDate, endDate } = parseRangeState

        if (!startDate) {
            onChange?.({ startDate: day, endDate })
        } else if (startDate && !endDate) {
            onChange?.(parseRange(startDate, day))
        } else {
            onChange?.({ startDate: day, endDate: null })
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
        const marked = markedDays?.filter((e) => isSame(e.date, day))?.[0]

        const conditions = {
            'rlc-day': true,
            'rlc-day-disabled': disableDates?.(day),
            'rlc-day-today': isSame(Date.now(), day),
            'rlc-day-inside-selection': dateIsBetween(day, sDate, eDate),
            'rlc-day-out-of-month': dateIsOut(day, firstMonthDay, lastMonthDay),
            'rlc-day-selected': !endDate && sDate === day,
            'rlc-day-start-selection': endDate && sDate === day,
            'rlc-day-end-selection': endDate && eDate === day,
            'rlc-day-marked': !!marked
        }

        return {
            style: { ...(!!marked && { ...marked.style }) },
            className: Object.entries(conditions).reduce(
                (prev, [className, valid]) =>
                    valid ? `${prev} ${className}` : prev,
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
                yearNavigation={yearNavigation}
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
                            onClickDate?.(day)
                            !disableDates?.(day) && onClickDay(day)
                        }}
                    >
                        {parseInt(tms.getDay(day), 10)}
                    </div>
                ))}
            </div>
        </div>
    )
}
