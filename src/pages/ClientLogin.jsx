import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginClient } from "../api/authService";
import { forgotPassword } from "../api/forgotPassword"; // ✅ uses your backend route
import SigninBg from "../assets/signinbg.png";
import navLogo from "../assets/nav-logo.png";
import { useError } from "../hooks/useError";

export default function ClientLogin() {
  const { showError } = useError();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotKey, setForgotKey] = useState("");
  const [recoveredPassword, setRecoveredPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔐 Handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginClient(email, password);
      navigate("/client-dashboard");
    } catch (err) {
      // ✅ Check if backend sent a message
      const backendMessage =
        err?.response?.data?.message || // from your controller
        err?.message || // fallback
        "Invalid credentials — Try 'Forgot Password'?"; // default

      showError(backendMessage);
    }
  };

  // 🔑 Handle forgot password (calls your backend)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await forgotPassword(forgotEmail, forgotKey);
      setRecoveredPassword(data.password);
      setFeedback({
        type: "success",
        message:
          "✅ Password reset successful! You can now use the new password below.",
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "❌ Invalid email or secret key. Please try again.",
      });
    }
  };

  return (
    <div
      className="relative z-0 w-full h-full bg-cover bg-center"
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

              <p
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>

              <button
                type="submit"
                className="w-full py-2 rounded-full font-semibold transition bg-black text-white hover:bg-gray-800"
              >
                Sign In
              </button>

              <div className="flex gap-4 items-center mt-4 md:hidden">
                <a
                  href="https://www.vetconnect.pro/"
                  className="w-6/12 bg-black text-white p-2 rounded-full font-semibold text-center hover:bg-gray-800 transition"
                >
                  Clinic
                </a>
                <Link
                  to="/client-register"
                  className="w-6/12 bg-black text-white p-2 rounded-full font-semibold text-center hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 🔐 Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Forgot Password
            </h2>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secret Key
                </label>
                <input
                  type="text"
                  value={forgotKey}
                  onChange={(e) => setForgotKey(e.target.value)}
                  placeholder="Enter your secret key"
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>

            {recoveredPassword && (
              <div className="mt-6 bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-inner">
                <p className="text-gray-700 font-medium mb-2 text-center">
                  🔐 Your new password has been reset successfully!
                </p>

                <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={recoveredPassword}
                    readOnly
                    className="flex-1 outline-none bg-transparent font-mono text-gray-900 text-lg"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-sm text-gray-500 hover:text-black transition"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(recoveredPassword);
                        setFeedback({
                          type: "success",
                          message: "Password copied to clipboard!",
                        });
                      }}
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Please keep your new password secure — you’ll need it to log
                  in.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ / ❌ Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div
            className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center ${
              feedback.type === "success"
                ? "border-green-500"
                : "border-red-500"
            } border-2`}
          >
            <p
              className={`text-lg font-semibold ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.message}
            </p>
            <button
              onClick={() => setFeedback(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
