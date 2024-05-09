import { Dispatch, SetStateAction, useState, useRef, MutableRefObject, useEffect } from "react";

const Alert = ({ color, children, id }: {
  color: string
  children: string
  id: string
}) => {
  // const ref: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const [show, setShow] = useState(true)
  useEffect(() => {
    setShow(true)
  }, [id])

  let promptClass: string = 'bg-red-500 inline-block rounded-lg p-1 mr-1'
  switch (color) {
    case 'green':
      promptClass = 'bg-green-500 inline-block rounded-lg p-1 mr-1'
      break
    case 'yellow':
      promptClass = 'bg-yellow-500 inline-block rounded-lg p-1 mr-1'
  }
  // tailwind only accept intact className string, template string composed ones are not allowed

  const [title, context] = children.split('; ')

  return (
    <div className={"shadow-md p-1 flex flex-row rounded-lg m-1 " + (!show? 'hidden' : '')}
      // id={id}
    >
      <div className={promptClass} />
      <b className='px-1'>{title}</b>
      <p className='px-1'>{context}</p>

      <span
        className="h-5 w-5 text-gray-500 inline-block px-1 ml-auto mr-1"
        onClick={() => setShow(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  )
}

export default Alert