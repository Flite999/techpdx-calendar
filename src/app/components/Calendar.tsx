import prisma from '../../../lib/prisma'
import CalendarNav from './CalendarNav';
import CalendarGrid from './CalendarGrid';
import { formatYm, monthBoundariesUTC, monthGrid, nextYm, parseYmParam, prevYm } from '../../../lib/dates';
import Events from './Events';

export default async function Calendar({ ym }: { ym?: string }) {
    const { year, month } = parseYmParam(ym)
    const { first, nextFirst } = monthBoundariesUTC(year, month)
    const events = await prisma.event.findMany({
        where: {
            AND: [
                { start_time: { lt: nextFirst } },
                { end_time: { gte: first } },
            ],
        },
        orderBy: { start_time: 'asc' },
    })

    const grid = monthGrid(year, month)
    const currentYm = formatYm(year, month)
    return (
        <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-800">Upcoming events</h2>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                    <CalendarNav key={`nav-${currentYm}`} currentYm={currentYm} />
                    <CalendarGrid
                        key={`grid-${currentYm}`}
                        year={year}
                        month={month}
                        grid={grid}
                        events={events}
                    />
                </div>
                <Events key={`list-${currentYm}`} events={events} />
            </div>
        </div>
    )
}
