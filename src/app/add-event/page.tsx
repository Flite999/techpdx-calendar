import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import AddEvent from '../components/AddEvent'
import ImportEvent from '../components/ImportEvent'

export default async function Page() {
    return (
        <div className="divide-y divide-gray-900/10 dark:divide-white/10">
            <AddEvent />
            <ImportEvent />
        </div>
    )
}
