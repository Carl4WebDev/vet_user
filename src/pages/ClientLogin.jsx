import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginClient } from "../api/authService";

import SigninBg from "../assets/signinbg.png";
import navLogo from "../assets/nav-logo.png";
import { useError } from "../hooks/useError";

export default function ClientLogin() {
  const { showError } = useError();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginClient(email, password);
      navigate("/client-dashboard");
    } catch (err) {
      showError(err.message);
    }
  };

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
        <div className="w-[80%] min-h-[80%] backdrop-blur-[5px] grid grid-cols-1 md:grid-cols-[2fr_2fr] shadow-2xl p-4">
          {/* Left Column */}
          <div className="bg-gray-900 text-white hidden md:flex flex-col justify-center items-center gap-4 p-8 rounded-l-lg">
            <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
            <Link
              to="/client-register"
              className="bg-white w-10/12 text-center text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Sign Up
            </Link>
            <a
              href="https://vetconnect-clinic.netlify.app/"
              target="_blank"
              className="bg-white w-10/12 text-center text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Clinic
            </a>
          </div>

          {/* Right Column */}
          <div className="flex justify-center items-center bg-white rounded-md">
            <form
              onSubmit={handleLogin}
              className="p-4 rounded-lg w-full mx-auto space-y-4"
            >
              <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>
              {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-blue-500 font-semibold">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Sign In
              </button>

              <div className="flex gap-4 items-center mt-4 md:hidden">
                <Link
                  to="/client-register"
                  className="w-6/12 bg-black text-white p-2 rounded-full font-semibold text-center hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
                <a
                  href="https://vet-ver1.netlify.app/"
                  className="w-6/12 bg-black text-white p-2 rounded-full font-semibold text-center hover:bg-gray-800 transition"
                >
                  Clinic
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
