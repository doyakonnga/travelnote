'use client'
import Image from "next/image"
import { ChangeEvent, useState } from "react"

const CreateJourneyForm = () => {
  const [object, setObject] = useState<File | undefined>(undefined)
  const [objectUrl, setObjectUrl] = useState('')

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target.files?.[0]
    setObject(inputFile)

    if (objectUrl) URL.revokeObjectURL
    if (inputFile) {
      setObjectUrl(URL.createObjectURL(inputFile))
    } else { setObjectUrl('') }

  }

  return (
    <form className="mt-8 space-y-3" action="#" method="POST">
      <div className="grid grid-cols-1 space-y-2">
        <label className="text-sm font-bold text-gray-500 tracking-wide">
          Title
        </label>
        <input
          className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          type=""
          placeholder="mail@gmail.com"
        />
      </div>
      <div className="grid grid-cols-1 space-y-2">
        <label className="text-sm font-bold text-gray-500 tracking-wide">
          Attach Document
        </label>
        {(!objectUrl &&
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
              <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                  <img
                    className="has-mask h-36 object-center"
                    src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                    alt="freepik image"
                  />
                </div>
                <p className="pointer-none text-gray-500 ">
                  <span className="text-sm">Drag and drop</span> files here{" "}
                  <br /> or{" "}
                  <span className="text-blue-600 hover:underline">
                    select a file
                  </span>{" "}
                  from your computer
                </p>
              </div>
              <input type="file" className="hidden" name="picture"
                onChange={handleFileInput}
              />
            </label>
          </div>)}

        {objectUrl && (
          <div className='flex'>
            <Image
              src={objectUrl}
              alt='selected image'
              width={500}
              height={500}
            />
            <button type="button" className="p-2 hover:bg-gray-200"
              onClick={() => {
                setObject(undefined)
                setObjectUrl('')
              }}
            >x</button>
          </div>
        )}

      </div>
      <p className="text-sm text-gray-300">
        <span>File type: images</span>
      </p>



      <div>
        <button
          type="submit"
          className="my-5 w-full flex justify-center bg-black text-white p-2 rounded-md tracking-wide hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          Setup
        </button>
      </div>
    </form>
  )
}

export default CreateJourneyForm
