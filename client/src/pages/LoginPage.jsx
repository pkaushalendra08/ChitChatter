import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { IoIosArrowBack } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext.jsx"

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    login(currState=== "Sign up" ? 'signup' : 'login', { fullName, email, password, bio});
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center px-6 py-8 bg-cover bg-center backdrop-blur-2xl">

      {/* --------------------left------------------- */}
      <div className="flex justify-center sm:justify-end sm:w-1/2 mb-8 sm:mb-0">
        <img
          src={assets.logo}
          alt="logo"
          className="w-[180px] sm:w-[240px] md:w-[320px] lg:w-[1000px] object-contain"
        />
      </div>

      {/* --------------------right------------------- */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 max-w-md border border-gray-600 bg-white/10 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col gap-6 backdrop-blur-lg"
      >
        <h2 className="font-semibold text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <IoIosArrowBack
              onClick={() => setIsDataSubmitted(false)}
              className="cursor-pointer text-gray-300 hover:text-white"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            required
            className="p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Enter Bio"
            required
            className="p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-500 to-violet-700 text-white rounded-md font-medium hover:opacity-90 transition"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" required/>
          <p>Agree to the terms of use and privacy policies.</p>
        </div>

        <div className="text-sm text-gray-300 text-center">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                className="text-violet-400 cursor-pointer font-medium hover:underline"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                className="text-violet-400 cursor-pointer font-medium hover:underline"
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
              >
                Click Here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage
