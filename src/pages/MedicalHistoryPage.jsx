import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Navbar from "../components/Navbar";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
import { getPetById } from "../api/pets/getPetById";

const client_name = localStorage.getItem("client_name");
const navProfileClient = localStorage.getItem("navProfileClient");

export default function MedicalHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { petId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPetById(petId);
        if (res.success && Array.isArray(res.data)) {
          setRecords(res.data);
        } else {
          setError("No medical records found.");
        }
      } catch (err) {
        console.error("❌ Error fetching pet records:", err);
        setError("Failed to load medical records.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [petId]);

  // 📄 Download as PDF
  function downloadPDF(records) {
    if (!records || records.length === 0) return;
    const pet = records[0];
    const doc = new jsPDF("p", "mm", "a4");

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Pet Medical History", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${pet.pet_name || "N/A"}`, 14, 28);
    doc.text(`Species: ${pet.pet_species || "N/A"}`, 14, 34);
    doc.text(`Breed: ${pet.pet_breed || "N/A"}`, 14, 40);
    doc.text(`Gender: ${pet.pet_gender || "N/A"}`, 100, 28);
    doc.text(`Age: ${pet.pet_age || "N/A"} year(s)`, 100, 34);
    doc.text(`Weight: ${pet.pet_weight || "N/A"} kg`, 100, 40);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);

    let currentY = 56;

    records.forEach((rec, index) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Record #${index + 1}`, 14, currentY);
      currentY += 6;

      // Visit Info
      autoTable(doc, {
        startY: currentY,
        head: [["Visit Date", "Time", "Type", "Veterinarian"]],
        body: [
          [
            rec.visit_date
              ? new Date(rec.visit_date).toLocaleDateString()
              : "N/A",
            rec.visit_time || "N/A",
            rec.visit_type || "N/A",
            rec.veterinarian_name || "N/A",
          ],
        ],
        theme: "grid",
        styles: { fontSize: 10 },
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // Vital Signs
      autoTable(doc, {
        startY: currentY,
        head: [["Weight", "Temperature", "Heart Rate", "Resp. Rate"]],
        body: [
          [
            rec.vital_weight || "N/A",
            rec.vital_temperature || "N/A",
            rec.vital_heart_rate || "N/A",
            rec.vital_resp_rate || "N/A",
          ],
        ],
        theme: "grid",
        styles: { fontSize: 10 },
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // Tests
      autoTable(doc, {
        startY: currentY,
        head: [["Fecal Examination", "Physical Examination"]],
        body: [
          [rec.fecal_examination || "N/A", rec.physical_examination || "N/A"],
        ],
        theme: "grid",
        styles: { fontSize: 10 },
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // Medication
      autoTable(doc, {
        startY: currentY,
        head: [["Medication Given", "Prescriptions", "Treatment"]],
        body: [
          [
            rec.medication_given || "N/A",
            rec.prescriptions || "N/A",
            rec.treatment || "N/A",
          ],
        ],
        theme: "grid",
        styles: { fontSize: 10 },
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // Diagnosis
      autoTable(doc, {
        startY: currentY,
        head: [["Primary Diagnosis", "Body Condition", "Overall Health"]],
        body: [
          [
            rec.primary_diagnosis || "N/A",
            rec.body_condition || "N/A",
            rec.overall_health || "N/A",
          ],
        ],
        theme: "grid",
        styles: { fontSize: 10 },
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // Notes
      doc.setFont("helvetica", "bold");
      doc.text("Notes & Actions", 14, currentY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      currentY += 5;

      doc.text(`Description: ${rec.description || "N/A"}`, 14, currentY, {
        maxWidth: 180,
      });
      currentY += 5;
      doc.text(`Test Results: ${rec.test_results || "N/A"}`, 14, currentY, {
        maxWidth: 180,
      });
      currentY += 5;
      doc.text(`Key Action: ${rec.key_action || "N/A"}`, 14, currentY, {
        maxWidth: 180,
      });
      currentY += 8;

      if (currentY > 260 && index !== records.length - 1) {
        doc.addPage();
        currentY = 20;
      }
    });

    doc.save(`${pet.pet_name || "pet"}-medical-history.pdf`);
  }

  if (loading)
    return <p className="text-center mt-10">Loading medical history...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Navbar
        logo={navLogo}
        profileImg={records[0]?.client_image_url || navProfile}
        username={records[0]?.client_name}
        navItems={clientNavItems}
      />
      <div
        id="pdf-content"
        className="bg-white shadow-lg w-full max-w-[1100px] mx-auto rounded-xl overflow-hidden border border-gray-300"
      >
        <div
          className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: "#f6f6f6" }}
        >
          <div className="self-start mb-10">
            <label className="text-left text-2xl font-semibold">
              {records[0]?.pet_name || "Pet"}&apos;s Medical History
            </label>
          </div>

          {records.map((rec, index) => (
            <div
              key={rec.record_id}
              className="bg-white shadow-lg w-full max-w-3xl mb-8"
            >
              <div className="bg-blue-600 text-white text-lg font-semibold p-4 text-center">
                Medical History #{index + 1}
              </div>

              <div className="mt-5 bg-[#D9D9D9] w-full max-w-[750px] mx-auto rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Visit Date</p>
                  <p className="font-semibold">
                    {rec.visit_date
                      ? new Date(rec.visit_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="font-semibold">{rec.visit_time || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="font-semibold">{rec.duration || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Visit Type</p>
                  <p className="font-semibold">{rec.visit_type || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                {/* Visit Info */}
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">
                    Visit Information
                  </h3>
                  <p>
                    <span className="font-semibold">Veterinarian:</span>{" "}
                    {rec.veterinarian_name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Chief Complaint:</span>{" "}
                    {rec.chief_complaint || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Visit Reason:</span>{" "}
                    {rec.visit_reason || "N/A"}
                  </p>
                </div>

                {/* Vitals */}
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">Vital Signs</h3>
                  <div className="grid grid-cols-2 gap-6 text-center mt-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Weight</p>
                      <p className="font-bold text-lg">
                        {rec.vital_weight || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Temperature</p>
                      <p className="font-bold text-lg">
                        {rec.vital_temperature || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Heart Rate</p>
                      <p className="font-bold text-lg">
                        {rec.vital_heart_rate || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Resp. Rate</p>
                      <p className="font-bold text-lg">
                        {rec.vital_resp_rate || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tests + Treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">
                    Test and Procedures
                  </h3>
                  <p>
                    <strong>Fecal Examination:</strong>{" "}
                    {rec.fecal_examination || "N/A"}
                  </p>
                  <p>
                    <strong>Physical Exam:</strong>{" "}
                    {rec.physical_examination || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">
                    Treatment and Medication
                  </h3>
                  <p>
                    <strong>Medication Given:</strong>{" "}
                    {rec.medication_given || "N/A"}
                  </p>
                  <p>
                    <strong>Prescriptions:</strong> {rec.prescriptions || "N/A"}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {rec.treatment || "N/A"}
                  </p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                {/* 🩺 Diagnosis and Assessment */}
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">
                    Diagnosis and Assessment
                  </h3>
                  <p>
                    <strong>Primary Diagnosis:</strong>{" "}
                    {rec.primary_diagnosis || "N/A"}
                  </p>
                  <p>
                    <strong>Body Condition:</strong>{" "}
                    {rec.body_condition || "N/A"}
                  </p>
                  <p>
                    <strong>Overall Health:</strong>{" "}
                    {rec.overall_health || "N/A"}
                  </p>
                </div>

                {/* 🧾 Notes */}
                <div className="p-4 rounded-lg shadow bg-[#f6f6f6]">
                  <h3 className="font-semibold mb-2 border-b">Notes</h3>
                  <p>{rec.description || rec.notes || "N/A"}</p>
                </div>
              </div>
              {/* 🖼️ Document Attachments */}
              <div className="p-4 rounded-lg shadow w-full bg-[#f6f6f6] mt-4">
                <h3 className="font-semibold mb-2 border-b">
                  Attached Documents
                </h3>

                {rec.documents && rec.documents.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {rec.documents.map((doc, docIndex) => {
                      const ext = doc.file_name
                        ? doc.file_name.split(".").pop().toLowerCase()
                        : "";
                      const isImage = [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "webp",
                      ].includes(ext);

                      return (
                        <div
                          key={doc.document_id || docIndex}
                          className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col items-center p-2"
                        >
                          {isImage ? (
                            <img
                              src={doc.document_url}
                              alt={doc.file_name || "Document"}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex flex-col justify-center items-center h-32 w-full bg-gray-100 rounded-md">
                              <p className="text-gray-600 text-xs text-center px-2">
                                {doc.file_name || "Document"}
                              </p>
                            </div>
                          )}
                          <a
                            href={doc.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs mt-2 hover:underline"
                          >
                            View / Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-32 bg-gray-100 rounded-md">
                    <p className="text-gray-500 text-sm italic">
                      No documents uploaded
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 flex justify-end w-full max-w-3xl">
                <button
                  onClick={() => downloadPDF(records)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
