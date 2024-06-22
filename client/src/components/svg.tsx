
// export const Add = ({ props }: { props?: {} }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       xmlnsXlink="http://www.w3.org/1999/xlink"
//       width="32px"
//       height="32px"
//       viewBox="0 -0.5 21 21"
//       version="1.1"
//       {...props}
//     >
//       <title>plus [#1469]</title>
//       <desc>Created with Sketch.</desc>
//       <defs></defs>
//       <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
//         <g
//           id="Dribbble-Light-Preview"
//           transform="translate(-99.000000, -440.000000)"
//           fill="#F2F2F2"
//         >
//           <g id="icons" transform="translate(56.000000, 160.000000)">
//             <path
//               d="M57.7,289 L54.55,289 L54.55,286 L52.45,286 L52.45,289 L49.3,289 L49.3,291 L52.45,291 L52.45,294 L54.55,294 L54.55,291 L57.7,291 L57.7,289 Z M55.6,280 L55.6,282 L61.9,282 L61.9,288 L64,288 L64,280 L55.6,280 Z M61.9,298 L55.6,298 L55.6,300 L64,300 L64,292 L61.9,292 L61.9,298 Z M45.1,292 L43,292 L43,300 L51.4,300 L51.4,298 L45.1,298 L45.1,292 Z M45.1,288 L43,288 L43,280 L51.4,280 L51.4,282 L45.1,282 L45.1,288 Z"
//               id="plus-[#1469]"
//             ></path>
//           </g>
//         </g>
//       </g>
//     </svg>
//   )
// }

export const Add = (props: { [key: string]: any }) => {
  const className: string = ('className' in props) && props.className
  return (
    <svg className={className || "w-6 h-6 text-gray-800 dark:text-white "}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24"
      {...props}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>)
}

export const AngleRight = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className || "w-6 h-6 text-gray-800 dark:text-white "}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
    </svg>
  )
}

export const AngleLeft = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className || "w-6 h-6 text-gray-800 dark:text-white"}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m15 19-7-7 7-7"
      />
    </svg >)
}

export const Folder = ({ className }: { className?: string }) => {
  return (
    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clipRule="evenodd" />
    </svg>
  )
}

export const FilePen = (props: { className?: string, [key: string]: any }) => {
  const { className, ...others } = props
  return (
    <svg className={className || "w-6 h-6 text-gray-800 dark:text-white "}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24"
      {...others}
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z" />
    </svg>
  )
}

export const ArrowRepeat = (props: { className?: string, [key: string]: any }) => {
  const { className, ...others } = props
  return (
    <svg className={className || "w-6 h-6 text-gray-800"}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24"
      {...others}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
    </svg>
  )
}

export const Close = (props: { className?: string, [key: string]: any }) => {
  const { className, ...others } = props
  return (
    <svg className={className || "w-6 h-6 text-gray-800 dark:text-white"}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24"
      {...others}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
    </svg>
  )
}

export const TrashBin = (props: { className?: string, [key: string]: any }) => {
  const { className, ...others } = props
  return (
    <svg className={ className || "w-6 h-6 text-gray-800 "}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24"
      {...others}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
    </svg>
  )
}

export const FileImage = (props: { className?: string, [key: string]: any }) => {
  const { className, ...others } = props
  return (
    <svg className={className || "w-6 h-6 text-gray-800 "}
      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" {...others}>
      <path fill="currentColor" d="M16 18H8l2.5-6 2 4 1.5-2 2 4Zm-1-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 18h8l-2-4-1.5 2-2-4L8 18Zm7-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    </svg>
  )
}