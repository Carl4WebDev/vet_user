import { useSuccess } from "../hooks/useSuccess";

const SuccessModal = () => {
  const { success, clearSuccess } = useSuccess();

  if (!success) return null; // No modal if no success message

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center border-2 border-black">
        <h2 className="text-green-600 font-bold text-lg">✅ Success</h2>
        <p className="mt-2">{success}</p>

        <button
          onClick={clearSuccess}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
