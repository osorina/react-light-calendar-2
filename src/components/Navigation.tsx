import * as React from 'react'

type Props = {
    monthLabels: string[]
    month: number
    year: string
    onChange: (offset: { yearOffset?: number; monthOffset?: number }) => void
}

const Navigation: React.FC<Props> = ({
    monthLabels,
    month,
    year,
    onChange
}) => {
    const prevYear = () => onChange({ yearOffset: -1 })
    const prevMonth = () => onChange({ monthOffset: -1 })

    const nextYear = () => onChange({ yearOffset: 1 })
    const nextMonth = () => onChange({ monthOffset: 1 })

    return (
        <div className='rlc-month-and-year-wrapper'>
            <div className='rlc-navigation-button-wrapper rlc-prevs'>
                <div
                    className='rlc-navigation-button rlc-prev-year'
                    onClick={prevYear}
                >
                    {'<<'}
                </div>
                <div
                    className='rlc-navigation-button rlc-prev-month'
                    onClick={prevMonth}
                >
                    {'<'}
                </div>
            </div>
            <div className='rlc-month-and-year'>
                {monthLabels[month - 1]} <span>{year}</span>
            </div>
            <div className='rlc-navigation-button-wrapper rlc-nexts'>
                <div
                    className='rlc-navigation-button rlc-next-month'
                    onClick={nextMonth}
                >
                    {'>'}
                </div>
                <div
                    className='rlc-navigation-button rlc-next-year'
                    onClick={nextYear}
                >
                    {'>>'}
                </div>
            </div>
        </div>
    )
}

export default Navigation
