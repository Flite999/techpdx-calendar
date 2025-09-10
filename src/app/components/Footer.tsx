export default function Footer() {
    return (
        <footer className="mt-20 md:mt-36 mx-4">
            <div className="flex gap-4 border-t lg:border-none border-neutral-400 pb-8 mb-5 flex-col lg:flex-row pt-4">
                <div className="w-full lg:w-2/3 ">
                    <a href="/">
                        <h1 className="text-lg font-bold">Tech PDX Calendar</h1>
                    </a>
                    <p className="text-sm">
                        The TechPDX Calendar is an OSS project maintained by the community in Portland, OR. We welcome your contributions!
                    </p>
                </div>
                <div className="flex lg:ml-auto gap-10 mt-1">
                    <div>

                        <ul className="flex flex-col gap-2 text-sm">
                            <li>
                                <a href="/subscribe" className="flex items-center gap-1 hover:no-underline hover:text-gray-600">
                                    Subscribe
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    className="flex items-center gap-1 hover:no-underline hover:text-gray-600"
                                >Event Blog </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.calendar.techpdx.io"
                                    className="flex items-center gap-1 hover:no-underline hover:text-gray-600"
                                >Github</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
