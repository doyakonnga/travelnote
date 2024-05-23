'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

const SelectionBar = () => {
  const pathElements = usePathname().split('/')
  const curPath = pathElements[3] || ''
  const basePath = pathElements.slice(0, 3).join('/')
  const current = "relative flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-gray-700"
  const option = "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"

  return (
    <div className="my-3">
      <ul className="flex items-center gap-2 text-sm font-medium">
        <li className="flex-1">
          <Link
            href={`${basePath}/consumption`}
            className={('consumption' === curPath) ? current: option}
          >
            Consumption
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href={`${basePath}/expense`}
            className={('expense' === curPath) ? current : option}
          >
            Expense
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href={`${basePath}/balance`}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            Balance
            {/* Notification number bubble */}
            {/* <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
              {" 8 "}
            </span> */}
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="#"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            Applications
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="#"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            API
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SelectionBar
