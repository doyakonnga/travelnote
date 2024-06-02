

const ConfirmModal = ({ text, loading, handleOk, handleCancel}: {
  text: string
  loading: boolean
  handleOk:()=>Promise<void>
  handleCancel:()=>void
}) => {
  return (
    <div className="fixed inset-0 m-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="z-30 bg-white p-4 rounded flex-col justify-center items-center w-80">
        <h1>{text}</h1>
        {loading ? (<h1>Loading...</h1>) :
          <div className="flex justify-between">
            <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
              onClick={handleOk}
            >
              OK
            </button>
            <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>}
      </div>
    </div>
  )
}

export default ConfirmModal
