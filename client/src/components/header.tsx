import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { cookies } from 'next/headers'
import UserDropdown from "./user-dropdown"

const Header = async () => {
  const current = "block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white"
  const others = 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'

  const Cookie = cookies().getAll().map((c) => {
    return `${c.name}=${c.value};`
  }).join(' ')

  let currentUser: {
    id: string,
    email: string,
    name: string,
    journeyIds: string[],
  }
  
  try {
    currentUser = (await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/user/currentuser', { 
      headers: { 
        Host: "travelnote.com",
        Cookie
      }}
    )).data.user
    console.log(currentUser)
  } catch(e) {
    console.log(e) 
  }


  // Host is a forbidden header in the Fetch Standard now.
  // https://github.com/nodejs/node/issues/50305
  // try {
  //   const response = await fetch('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/user/currentuser', { "headers": { Host: "travelnote.com" } })
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const data = await response.json()
  //   console.log('data:', data.user)
  // } catch (error) {
  //   console.error('error:', error)
  // }

  return (
    <div>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <Image
              src="/dfsbdfb.png"
              className="rounded-full mx-2"
              width={50}
              height={50}
              alt="Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              TravelNote
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <Link
              href="/login"
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log in
            </Link>
            <a
              href="#"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Get started
            </a>
            <UserDropdown/>

            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/"
                  className={current}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={others}
                >
                  Company
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={others}
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={others}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={others}
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <script src="https://unpkg.com/flowbite@1.4.7/dist/flowbite.js"></script>
    </div>
  )
}

export default Header
