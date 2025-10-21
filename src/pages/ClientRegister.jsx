import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerClient } from "../api/authService";
import InputField from "../components/Forms/InputField";
import SelectField from "../components/Forms/SelectedField";
import AddressModal from "../components/Forms/AddressModal";
import { useError } from "../hooks/useError";
import SigninBg from "../assets/signinbg.png";
import navLogo from "../assets/nav-logo.png";

export default function ClientRegister() {
  const navigate = useNavigate();
  const { showError } = useError();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const [address, setAddress] = useState({
    country: "",
    street: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    unit: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      setShowTermsModal(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const data = await registerClient({ ...form, address });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate("/client-dashboard");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div
      className="w-full h-full lg:h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${SigninBg})` }}
    >
      <header className="bg-gray-200 flex items-center gap-2 px-6 py-3 mb-10">
        <img src={navLogo} alt="VetConnect Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold -translate-y-1">
          VetConnect in pet we care
        </h1>
      </header>

      <div className="flex justify-center items-center p-4 w-full ">
        <div className="bg-white/10 backdrop-blur-md rounded-md shadow-lg p-4 w-full max-w-2xl overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded-md w-full "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
              <InputField
                label="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
              <InputField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              <InputField
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
              <SelectField
                label="Gender"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                required
              />
              <InputField
                label="Telephone Number"
                type="tel"
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
              <InputField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <InputField
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Address
            </button>

            <div className="text-sm flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="tos"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
                className="accent-blue-500"
              />
              <label htmlFor="tos" className="text-black">
                Yes, I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-400 underline"
                >
                  Terms of Service
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition mt-4"
            >
              Sign Up
            </button>

            <Link to="/">
              <button className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition mt-2">
                Back to Sign In
              </button>
            </Link>
          </form>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={address}
        setAddress={setAddress}
      />

      {/* 📜 Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">
              VetConnect Terms & Conditions
            </h2>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
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
              implementing rules and regulations.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAccepted(true);
                  setShowTermsModal(false);
                }}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
