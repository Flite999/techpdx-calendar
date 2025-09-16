import EventDetail from '@/app/components/EventDetail'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <EventDetail id={slug} />
    )
}