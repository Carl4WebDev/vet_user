// components/VetMapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function VetMapContainer({ vets = [], isFreelance = false }) {
  // Default center: Manila City Hall
  const defaultCenter = [14.5898, 120.9841];

  // 📍 Show freelancers as a single generic cluster pin
  const displayVets = isFreelance
    ? [] // 🧠 freelancers have no coordinates, skip markers
    : vets.filter((v) => v?.address?.latitude && v?.address?.longitude);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
        zIndex: "0",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* 🩵 Clinics only (with address) */}
      {displayVets.map((clinic, index) => (
        <Marker
          key={clinic.clinic_id || index}
          position={[clinic.address.latitude, clinic.address.longitude]}
        >
          <Popup>
            <strong>{clinic.clinic_name}</strong>
            <br />
            {clinic.address.street}, {clinic.address.city}
            <br />
            📞 {clinic.contact_number || "N/A"}
          </Popup>
        </Marker>
      ))}

      {/* 🟢 Optional generic pin for freelancers */}
      {isFreelance && (
        <Marker position={defaultCenter}>
          <Popup>
            <strong>Veterinarian Freelancers</strong>
            <br />
            Freelancers do not have physical locations.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
