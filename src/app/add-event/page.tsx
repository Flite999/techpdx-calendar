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
