export const dynamic = 'force-dynamic' // SSR each navigation
export const revalidate = 0
export const fetchCache = 'force-no-store'

import Calendar from "./components/Calendar";

export default async function Home({ searchParams }: { searchParams: Promise<{ ym?: string }> }) {
  const sp = await searchParams
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Calendar ym={sp.ym} />
      </main>
    </div>
  );
}
