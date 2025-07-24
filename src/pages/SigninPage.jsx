import React from "react";
import { Link } from "react-router-dom";

import SigninBg from "../assets/signinbg.png";
import navLogo from "../assets/nav-logo.png";

const SigninPage = () => {
  return (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${SigninBg})` }}
    >
      <header className="bg-gray-200 flex items-center gap-2 px-6 py-3">
        <img src={navLogo} alt="VetConnect Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold -translate-y-1">
          VetConnect in pet we care
        </h1>
      </header>

      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-[80%] min-h-[80%]  backdrop-blur-[5px] grid grid-cols-1 md:grid-cols-[2fr_2fr] shadow-2xl p-8">
          {/* Left Column: 1/3 */}
          <div className="bg-gray-900 text-white hidden md:flex flex-col justify-center items-center gap-4 p-8 min-w-0 rounded-l-lg">
            <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
            <Link
              to={"/signup"}
              className="bg-white w-10/12 text-center text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition pointer-events-auto"
            >
              Sign Up
            </Link>
            <a
              href="https://vet-ver1.netlify.app/"
              target="_blank"
              className="bg-white w-10/12 text-center text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition pointer-events-auto"
            >
              Sign in as Clinic owner
            </a>
          </div>

          {/* Right Column: 2/3 */}
          <div className=" flex justify-center items-center bg-white rounded-md ">
            <form className="p-8 rounded-lg  w-full mx-auto ">
              <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4 flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="text-blue-500 font-semibold">
                  Forgot password?
                </a>
              </div>

              <div className="flex flex-col gap-4 items-center mb-4 pointer-events-auto">
                <Link
                  to={"/dashboard"}
                  className=" text-center bg-black w-10/12 text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition"
                >
                  <button>Sign In</button>
                </Link>
              </div>
              <hr className="md:hidden" />
              <div className="flex flex-col gap-4 items-center mt-4">
                <button className="w-10/12 md:hidden  bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                  <a href="https://vet-ver1.netlify.app/">
                    Sign in as Clinic owner
                  </a>
                </button>
                <button className="w-10/12 md:hidden bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
