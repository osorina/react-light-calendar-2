import times from 'lodash.times'
import tms from 'timestamp-utils'

const MONTHS_LENGHT = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24

export const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

export const initMonth = (timestamp = Date.now()) => {
    const [year, month, dayNumber] = tms.decompose(timestamp)
    const firstMonthDay = getDateWithoutTime(
        tms.addDays(timestamp, -dayNumber + 1)
    )
    const monthLenght = MONTHS_LENGHT[month - 1] || (isLeapYear(year) ? 29 : 28)
    const lastMonthDay = tms.addDays(firstMonthDay, monthLenght - 1)
    const firstMonthDayNumber = tms.getWeekDay(firstMonthDay)
    const firstDayToDisplay = tms.addDays(firstMonthDay, -firstMonthDayNumber)

    return {
        firstMonthDay,
        lastMonthDay,
        firstDayToDisplay,
        month,
        year
    }
}

export const parseRange = (startDate?: number, endDate?: number) => ({
    startDate: endDate
        ? startDate
            ? Math.min(startDate, endDate)
            : null
        : startDate,
    endDate:
        endDate && endDate !== startDate
            ? Math.max(startDate || 0, endDate)
            : null
})

export const getDays = (firstDay: number, lastDay: number) => {
    const lastDayNumber = tms.getWeekDay(lastDay)
    const nextMonthDaysCount = lastDayNumber === 6 ? 0 : 6 - lastDayNumber
    const daysCount =
        (lastDay - firstDay) / DAY_IN_MILLISECONDS + nextMonthDaysCount + 1
    return times(daysCount, (i: number) => tms.addDays(firstDay, i))
}

export const getDateWithoutTime = (timestamp: number) => {
    const [, , , hours, minutes, seconds, milliseconds] = tms.decompose(
        timestamp
    )
    return tms.add(timestamp, {
        hours: -hours,
        minutes: -minutes,
        seconds: -seconds,
        milliseconds: -milliseconds
    })
}

export const dateIsBetween = (date: number, start: number, end: number) =>
    date > start && date < end

export const dateIsOut = (date: number, start: number, end: number) =>
    date < start || date > end

export const formartTime = (value: number) => `0${value}`.slice(-2)
