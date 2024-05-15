import CreateJourneyForm from '@/components/create-journey-form'

const page = () => {
  return (
      <div
        className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover relative items-center"
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0" />
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900">A New Journey</h2>
            <p className="mt-2 text-sm text-gray-400">
              Lorem ipsum is placeholder text.
            </p>
          </div>

          <CreateJourneyForm/>

        </div>
      </div>
  )
}

export default page
