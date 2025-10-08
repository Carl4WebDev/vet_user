import { useEffect, useState } from "react";
import { getPetMedRecordsById } from "../api/medicalRecords/getPetMedRecordsById";

import { useParams } from "react-router-dom";

import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
const client_name = localStorage.getItem("client_name");

import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MedicalHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { petId } = useParams();
  // For now, hardcode a petId (later you can get it from params or props)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPetMedRecordsById(petId);
        if (res.success) {
          setRecords(res.data);
        } else {
          setError("Failed to load records");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching medical records");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [petId]);
  function downloadPDF(records) {
    if (!records || records.length === 0) return;

    const pet = records[0];
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 🐶 Header
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

    // Loop through each medical record
    records.forEach((rec, index) => {
      // Record header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Record #${index + 1}`, 14, currentY);
      currentY += 6;

      // 📅 Visit Info Table
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
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // 🩺 Vital Signs Table
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
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // 🧪 Tests Table
      autoTable(doc, {
        startY: currentY,
        head: [["Fecal Examination", "Physical Examination"]],
        body: [
          [rec.fecal_examination || "N/A", rec.physical_examination || "N/A"],
        ],
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // 💊 Medication Table
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
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // 🧠 Diagnosis Table
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
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = doc.lastAutoTable.finalY + 6;

      // 📝 Notes Section
      if (rec.description || rec.test_results || rec.key_action) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
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
      }

      // Add a page if we get near the bottom
      if (currentY > 250 && index !== records.length - 1) {
        doc.addPage();
        currentY = 20;
      }
    });

    doc.save(`${pet.pet_name || "pet"}-medical-history.pdf`);
  }

  if (loading) {
    return <p className="text-center mt-10">Loading medical history...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar
        logo={navLogo}
        profileImg={navProfile}
        username={client_name}
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
            <label
              htmlFor="PetsMedHistory"
              className=" text-left text-2xl font-semibold "
            >
              Leo&apos;s Medical History
            </label>
          </div>

          {records.map((rec, index) => (
            <div
              key={rec.record_id}
              className="bg-white shadow-lg w-full max-w-3xl mb-8"
            >
              {/* Header */}
              <div className="bg-blue-600 text-white text-lg font-semibold p-4 text-center">
                Medical History #{index + 1}
              </div>

              {/* Visit Info Top Section */}
              <div className="mt-5 bg-[#D9D9D9] w-full max-w-[750px] mx-auto rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Visit Date</p>
                  <p className="font-semibold">{rec.visit_date || "N/A"}</p>
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

              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                {/* Visit Information */}
                <div
                  className=" p-4 rounded-lg shadow"
                  style={{ backgroundColor: "#f6f6f6" }}
                >
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Visit Information
                  </h3>
                  <p>
                    <span className="font-semibold">Veterinarian:</span>{" "}
                    <br className="mb-1" />
                    {rec.veterinarian_name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Chief Complaint:</span>{" "}
                    <br className="mb-1" /> {rec.chief_complaint || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Visit Reason:</span>{" "}
                    <br className="mb-1" /> {rec.visit_reason || "N/A"}
                  </p>
                </div>

                {/* Vital Signs */}
                <div
                  className=" p-4 rounded-lg shadow"
                  style={{ backgroundColor: "#f6f6f6" }}
                >
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-center mt-4 ">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Weight</p>
                      <p className="font-bold text-lg">
                        {rec.pet_weight || "N/A"}
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

              {/* Tests and Treatments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                <div
                  className="  p-4 rounded-lg shadow "
                  style={{ backgroundColor: "#f6f6f6" }}
                >
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Test and Procedures
                  </h3>
                  <p className="mb-10">
                    <span className="font-semibold mr-25  ">
                      Fecal Examination:
                    </span>
                    {rec.fecal_examination || "N/A"}
                  </p>
                  <p className="mb-20">
                    <span className="font-semibold mr-32">Physical Exam:</span>
                    {rec.physical_examination || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Treatment and Medication
                  </h3>
                  <p className="mb-10">
                    <span className="font-semibold mr-32">
                      Medication Given:
                    </span>
                    {rec.medication_given || "N/A"}
                  </p>
                  <p className="mb-10">
                    <span className="font-semibold mr-40">Prescriptions:</span>
                    {rec.prescriptions || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold mr-20">Treatment:</span>
                    {rec.treatment || "N/A"}
                  </p>
                </div>
              </div>

              {/* Diagnosis and Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-10">
                <div
                  className="  p-4 rounded-lg shadow"
                  style={{ backgroundColor: "#f6f6f6" }}
                >
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Diagnosis and Assessment
                  </h3>
                  <p className="mb-10">
                    <span className="font-semibold mr-25">
                      Primary Diagnosis:
                    </span>
                    {rec.primary_diagnosis || "N/A"}
                  </p>
                  <p className="mb-10">
                    <span className="font-semibold mr-27">Body Condition:</span>{" "}
                    {rec.body_condition || "N/A"}
                  </p>
                  <p className="mb-10">
                    <span className="font-semibold mr-30 ">
                      Overall Health:
                    </span>
                    {rec.overall_health || "N/A"}
                  </p>
                </div>
                <div
                  className="  p-4 rounded-lg shadow"
                  style={{ backgroundColor: "#f6f6f6" }}
                >
                  <h3 className="font-semibold mb-2 border-b border-[000000] ">
                    Documents
                  </h3>
                  {rec.documents && rec.documents.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {rec.documents.map((doc, i) => (
                        <li key={i}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Document {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No documents available</p>
                  )}
                </div>
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
