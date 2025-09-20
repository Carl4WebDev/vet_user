export default function AddressModal({ isOpen, onClose, address, setAddress }) {
  if (!isOpen) return null;

  const handleChange = (key, value) => setAddress({ ...address, [key]: value });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative overflow-y-auto border-2 border-black"
          style={{ maxHeight: "80vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4">Address Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Country Name"
              value={address.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
            <Input
              label="Street Name"
              value={address.street}
              onChange={(e) => handleChange("street", e.target.value)}
            />
            <Input
              label="Province"
              value={address.province}
              onChange={(e) => handleChange("province", e.target.value)}
            />
            <Input
              label="City"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            <Input
              label="Barangay"
              value={address.barangay}
              onChange={(e) => handleChange("barangay", e.target.value)}
            />
            <Input
              label="Postal Code"
              value={address.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
            />
            <Input
              label="Unit Number"
              value={address.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
