
import Link from "next/link"
import GoogleOauthButton from '@/components/google-oauth-button'
import LoginForm from "@/components/login-form"

const page = () => {
  return   (
  <div className="w-full h-5/6 bg-gray-100 flex items-center justify-center my-auto">
    <div className="max-w-md w-full p-6">
      <h1 className="text-3xl font-semibold mb-6 text-black text-center">
        Log In
      </h1>
      <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
        Join to Our Community with all time access and free{" "}
      </h1>
      <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 mb-2 lg:mb-0">
          <GoogleOauthButton>
            Log in with Google
          </GoogleOauthButton>
        </div>
        <div className="w-full lg:w-1/2 ml-0 lg:ml-2">
          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              id="github"
              className="w-4"
            >
              <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z" />
            </svg>{" "}
            Log in with Github{" "}
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>or with email</p>
      </div>

      <LoginForm></LoginForm>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/signup" className="text-black hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  </div>)
}

export default page
