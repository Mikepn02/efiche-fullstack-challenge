import Link from 'next/link'
import React from 'react'

type StatsCardProps = {
    title: string
    value: string | number
    link?: string
    icon?: React.ReactNode
    subtitle?: string
}

const StatsCard = ({ title, value, link, icon, subtitle }: StatsCardProps) => {
    return (
        <div className="w-full bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-gray-100">
            <div className="w-full flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm text-gray-500 uppercase tracking-wide font-medium">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                {icon && (
                    <div className="shrink-0 bg-gray-50 p-2 rounded-lg">
                        {icon}
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-end justify-between w-full">
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900">{value}</p>
                {link ? (
                    <Link href={link} className="text-sm text-blue-600 hover:underline">
                        View more &rarr;
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

export default StatsCard