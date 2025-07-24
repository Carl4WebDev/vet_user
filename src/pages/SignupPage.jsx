import { useState } from "react";
import { Link } from "react-router-dom";

import SigninBg from "../assets/signinbg.png";
import navLogo from "../assets/nav-logo.png";

const SignupPage = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div
      className="w-full h-full sm:h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${SigninBg})` }}
    >
      <header className="bg-gray-200 flex items-center gap-2 px-6 py-3">
        <img src={navLogo} alt="VetConnect Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold -translate-y-1">
          VetConnect in pet we care
        </h1>
      </header>
      <div className="flex justify-center items-center p-4 w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-md shadow-lg p-4 w-full max-w-2xl">
          <form className="space-y-4 bg-white p-4 rounded-md w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="+63 9475731310"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Telephone Number */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. (02) 8123 4567"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="***************"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="***************"
                  required
                />
              </div>
            </div>

            {/* Address Modal Trigger */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Address
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="text-sm flex items-center gap-2 mt-4">
              <input type="checkbox" id="tos" className="accent-blue-500" />
              <label htmlFor="tos" className="text-black">
                Yes, I agree to the{" "}
                <a href="#" className="text-blue-400 underline">
                  Terms of Service
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition mt-4"
            >
              Create Account
            </button>

            <Link to={"/"}>
              <button
                className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition mt-2"
                type="submit"
              >
                Back to Sign In
              </button>
            </Link>
          </form>
        </div>

        {/* Modal */}
        {isAddressModalOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 border-2  bg-opacity-50 z-40"
              onClick={() => setIsAddressModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 flex justify-center items-center z-50 p-4 ">
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] p-4 sm:p-6 relative overflow-y-auto border-2 border-black"
                style={{ minWidth: "300px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Address Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Street Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Street Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Province
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Batangas"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Lipa"
                    />
                  </div>

                  {/* Barangay */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Barangay
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Barangay Uno"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="4217"
                    />
                  </div>

                  {/* Unit Number */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Unit Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Unit 2A"
                    />
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
