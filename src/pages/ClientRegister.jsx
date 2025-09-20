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

    if (form.password !== form.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const data = await registerClient({ ...form, address });

      // ✅ Save token & role to localStorage (Auto-login)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ Redirect straight to dashboard
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
      {/* Header */}
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
                required
                className="accent-blue-500"
              />
              <label htmlFor="tos" className="text-black">
                Yes, I agree to the{" "}
                <a href="#" className="text-blue-400 underline">
                  Terms of Service
                </a>
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
    </div>
  );
}
