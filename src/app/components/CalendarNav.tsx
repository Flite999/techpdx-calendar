'use client'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/20/solid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = { currentYm: string }

export default function CalendarNav({ currentYm }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const go = (delta: number) => {
        const [yStr, mStr] = currentYm.split('-')
        const y = Number(yStr), m = Number(mStr) // 1..12

        const base = new Date(Date.UTC(y, m - 1, 1))
        const moved = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + delta, 1))
        const ymNew = `${moved.getUTCFullYear()}-${String(moved.getUTCMonth() + 1).padStart(2, '0')}`

        console.log('Nav push:', { from: currentYm, to: ymNew, pathname })
        router.push(`${pathname}?ym=${ymNew}`)
        router.refresh() // keep this ON while debugging Next 15 searchParams
    }

    const label = new Date(Number(currentYm.slice(0, 4)), Number(currentYm.slice(5)) - 1, 1)
        .toLocaleString(undefined, { month: 'long', year: 'numeric' })
    return (
        <div className="flex items-center text-gray-900 dark:text-white">
            <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white"
                onClick={() => go(-1)}
            >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            <div className="flex-auto text-sm font-semibold dark:text-gray-600">{label}</div>
            <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white"
                onClick={() => go(1)}
            >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
        </div>
    )
}