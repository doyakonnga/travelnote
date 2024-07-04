'use client'
import Link from 'next/link'
import React from 'react'
import { useState, useRef, useEffect } from 'react'

const UserDropdown = ({ currentUser }: {
  currentUser:
  {
    id: string,
    email: string,
    name: string,
    avatar: string
    journeyIds: string[],
  }
}) => {

  const toggleButton: React.MutableRefObject<null | HTMLButtonElement> = useRef(null)
  const panel = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panel.current && toggleButton.current &&
        !e.composedPath().includes(panel.current) &&
        !e.composedPath().includes(toggleButton.current)
      )
        setExpanded(false)
    }
    const handleKeydownEsc = (e: KeyboardEvent) => {
      if (e.code === 'Escape')
        setExpanded(false)
    }
    if (!expanded) return () => {}
    document.body.addEventListener('click', handleClickOutside)
    document.body.addEventListener('keydown', handleKeydownEsc)
    return () => { 
      document.body.removeEventListener('click', handleClickOutside)
      document.body.removeEventListener('keydown', handleKeydownEsc)
    }
  }, [expanded])

  return (

    <div className="flex justify-center">
      <div className="relative inline-block">
        {/* Dropdown toggle button */}
        <button className="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none"
          ref={toggleButton}
          onClick={() => { setExpanded(expanded => !expanded) }}
        >
          <span className="mx-1">{currentUser.name}</span>
          <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor" />
          </svg>
        </button>
        {/* Dropdown menu */}
        {expanded &&
          <div ref={panel}>
            <div className="absolute right-0 z-20 w-72 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 border border-gray-500">
              <a href="/user" className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                <img className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9" src={currentUser.avatar || '/user.png'} alt="user avatar" />
                <div className="mx-1">
                  <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{ currentUser.name || 'User' + currentUser.id }</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                </div>
              </a>
              <hr className="border-gray-200 dark:border-gray-700 " />
              <a href="/user" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                view profile
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Settings
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Keyboard shortcuts
              </a>
              <hr className="border-gray-200 dark:border-gray-700 " />
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Company profile
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Team
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Invite colleagues
              </a>
              <hr className="border-gray-200 dark:border-gray-700 " />
              <a href="#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Help
              </a>
              <a href="/api/v1/user/logout" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Log Out
              </a>
            </div>
          </div>}
      </div>
    </div>
  )
}

export default UserDropdown