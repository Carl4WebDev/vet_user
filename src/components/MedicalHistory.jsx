// components/MedicalHistory.jsx
import { ArrowRight, TimerIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function MedicalHistory({ pets }) {
  return (
    <div className="bg-white rounded p-4">
      <h1 className="mb-4 font-bold">Medical History</h1>

      <div className="flex flex-col gap-4">
        {pets && pets.length > 0 ? (
          pets.map((pet) => (
            <div
              key={pet.pet_id} // use a unique identifier
              className="flex bg-[#eee1c6] items-center justify-between p-4 border-l-8 border-[#ffa673] rounded-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={pet.image || "/default-pet.png"} // fallback if no image
                  alt={pet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold">{pet.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TimerIcon size={16} />
                    <p>{pet.recordCount || 0} Records</p>
                  </div>
                </div>
              </div>
              <Link to={`/medical-history/${pet.pet_id}`}>
                <ArrowRight className="w-10 h-10 md:w-20 md:h-20" />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pets found.</p>
        )}
      </div>
    </div>
  );
}
