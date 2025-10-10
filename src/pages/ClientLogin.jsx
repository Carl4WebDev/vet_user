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
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [tempUser, setTempUser] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!accepted) {
        setShowModal(true);
        return;
      }

      // simulate failed login
      if (!email.includes("@") || password.trim() === "") {
        setTempUser(email);
        showError("Invalid credentials — Try 'Forgot Password'?");
        return;
      }

      await loginClient(email, password);
      navigate("/client-dashboard");
    } catch (err) {
      setTempUser(email);
      showError("Invalid credentials — Try 'Forgot Password'?");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const correctAnswer = tempUser.split("@")[0].toLowerCase();
    if (forgotAnswer.toLowerCase() === correctAnswer) {
      // ✅ Success
      setEmail(tempUser);
      setPassword("123456");
      setFeedback({
        type: "success",
        message:
          "✅ Password reset successful! We've filled your account with default password 123456.",
      });
      setShowForgotModal(false);
    } else {
      // ❌ Wrong answer
      setFeedback({
        type: "error",
        message: "❌ Incorrect answer. Please try again.",
      });
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

              {/* Forgot password link */}
              <p
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>

              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="cursor-pointer"
                />
                <p>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 underline"
                  >
                    Terms and Conditions
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={!accepted}
                className={`w-full py-2 rounded-full font-semibold transition ${
                  accepted
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
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

      {/* 🧾 Terms Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">
              VetConnect Terms & Conditions
            </h2>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
              {/* keep your existing text */}
              Welcome to VetConnect, a digital platform designed to streamline
              veterinary practice management and enhance pet-owner healthcare
              engagement. By accessing or using the VetConnect System you
              acknowledge that you have read, understood, and agreed to comply
              with these Terms and Conditions, including our Privacy Policy, in
              compliance with the Data Privacy Act of 2012 (Republic Act No.
              10173). If you do not agree with any of the provisions herein, you
              are advised to discontinue use of the Application. VetConnect
              provides services that include electronic health records
              management for pets, appointment scheduling and reminders, secure
              communication between veterinary clinics and pet owners, access to
              medical history and treatment notes, as well as business
              intelligence dashboards for veterinary practices. These services
              are intended solely for lawful purposes relating to veterinary
              care and practice management. As a user of the Application, you
              agree to provide accurate and up-to-date information at all times,
              to maintain the confidentiality of your login credentials, and to
              use the System responsibly and lawfully. You further agree not to
              misuse the Application in any way, including but not limited to
              unauthorized access, data manipulation, or any activity that may
              compromise the integrity of the platform. VetConnect is fully
              committed to protecting the privacy and confidentiality of its
              users in accordance with the Data Privacy Act of 2012. By using
              the System, you give explicit consent to the collection and
              processing of your personal information and sensitive personal
              information. Data collected will be limited only to what is
              necessary for veterinary care, appointment management,
              communication, and analytics. All collected information will be
              securely stored with appropriate encryption and access controls.
              Information will not be shared with third parties without your
              consent, except with authorized veterinary staff or as required by
              law. You retain the right to access, update, correct, or request
              deletion of your personal information, consistent with the
              provisions of RA 10173. While the Application provides tools to
              support communication and record-keeping, VetConnect does not
              provide direct veterinary advice and is not liable for any
              misdiagnosis, treatment errors, or medical outcomes. The accuracy
              of all information entered into the System is the sole
              responsibility of the user. All content, software, design
              elements, and intellectual property within the VetConnect
              Application are the exclusive property of VetConnect. These may
              not be copied, modified, distributed, or used in any form without
              prior written consent from the company. We reserve the right to
              suspend or terminate user accounts that violate these Terms and
              Conditions, engage in fraudulent or illegal activity, or
              compromise the security of the platform. Additionally, VetConnect
              may update or amend these Terms and Conditions at any time. Users
              will be notified of significant changes through email or in-app
              notifications, and continued use of the Application after such
              updates will constitute acceptance of the revised terms. These
              Terms and Conditions shall be governed by the laws of the Republic
              of the Philippines, including the Data Privacy Act of 2012 and its
              implementing rules and regulations. For any questions, concerns,
              or requests regarding these Terms and Conditions or data privacy
              matters, you may contact the VetConnect Data Protection Officer
              (DPO) through the official email address or hotline provided
              within the Application.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAccepted(true);
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Forgot Password
            </h2>
            {tempUser ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-gray-700 text-sm mb-2">
                  🔒 Security Question:
                </p>
                <p className="font-medium text-gray-900">
                  What are the letters before “@” in your email?
                </p>
                <input
                  type="text"
                  value={forgotAnswer}
                  onChange={(e) => setForgotAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                  required
                />
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
            ) : (
              <p className="text-gray-600 text-center">
                Please try to log in first with your email. The system will
                record your email for password recovery.
              </p>
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
