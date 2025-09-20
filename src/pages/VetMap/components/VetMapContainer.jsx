// components/VetMapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function VetMapContainer({ vets = [] }) {
  // Default center: Manila City Hall
  const center = [14.5898, 120.9841];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
        zIndex: "0",
      }}
    >
      {/* OpenStreetMap tiles (free) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {vets.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.address.latitude, clinic.address.longitude]}
        >
          <Popup>
            <strong>{clinic.name}</strong>
            <br />
            {clinic.address.street}, {clinic.address.city}
            <br />
            📞 {clinic.phoneNumber}
            <br />
            Active: {clinic.isActive ? "✅" : "❌"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
