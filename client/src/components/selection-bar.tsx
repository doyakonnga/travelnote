'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

const SelectionBar = () => {
  const pathElements = usePathname().split('/')
  const curPath = pathElements[2] || ''
  const basePath = pathElements.slice(0, 2).join('/')
  const current = "relative flex items-center justify-center gap-2 rounded-t-lg bg-gray-50 px-3 py-2 text-gray-700"
  const option = "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700"

  return (
    <div className="mt-5 mb-3">
      <ul className="flex items-center gap-2 text-sm font-medium">
        <li className="flex-1">
          <Link
            href={`${basePath}/consumptions`}
            className={('consumptions' === curPath) ? current: option}
          >
            Consumptions
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href={`${basePath}/expenses`}
            className={('expenses' === curPath) ? current : option}
          >
            Expenses
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href={`${basePath}/balances`}
            className={('balances' === curPath) ? current : option}
          >
            Balances
            {/* Notification number bubble */}
            {/* <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
              {" 8 "}
            </span> */}
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href={`${basePath}/albums`}
            className={('albums' === curPath) ? current : option}
          >
            Albums
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="#"
            className={('notifications' === curPath) ? current : option}
          >
            Notification
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SelectionBar
