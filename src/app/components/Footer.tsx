import { JSX, SVGProps } from "react"

const navigation = {
    TechPDXCalendar: [
        { name: 'Subscribe to Calendar', href: 'webcal://calendar.techpdx.io/api/feed.ics' },
        { name: 'Event Blog', href: 'https://www.techpdx.io' },
    ],
    social: [
        {
            name: 'GitHub',
            href: 'https://github.com/Flite999/techpdx-calendar',
            icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    ],
}

export default function Example() {
    return (
        <footer className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">TechPDX Calendar</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.TechPDXCalendar.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                    </div>
                    {/* <div className="mt-10 xl:mt-0">
                        <h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">Subscribe to our newsletter</h3>
                        <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-400">
                            The latest news, articles, and resources, sent to your inbox weekly.
                        </p>
                        <form className="mt-6 sm:flex sm:max-w-md">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email-address"
                                type="email"
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full min-w-0 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:w-64 sm:text-sm/6 xl:w-full dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:focus:outline-indigo-500"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div> */}
                </div>
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24 dark:border-white/10">
                    <div className="flex gap-x-6 md:order-2">
                        {navigation.social.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                <span className="sr-only">{item.name}</span>
                                <item.icon aria-hidden="true" className="size-6" />
                            </a>
                        ))}
                    </div>
                    <p className="mt-8 text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400">
                        The TechPDX Calendar is an OSS project maintained by the community in Portland, OR. We welcome your contributions!
                    </p>
                </div>
            </div>
        </footer>
    )
}
