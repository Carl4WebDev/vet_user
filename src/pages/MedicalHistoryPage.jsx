import { useEffect, useState } from "react";
import { getPetMedRecordsById } from "../api/medicalRecords/getPetMedRecordsById";

import { useParams } from "react-router-dom";

import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
const client_name = localStorage.getItem("client_name");

import Navbar from "../components/Navbar";

import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";

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

  function downloadPDF() {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    toPng(input, { cacheBust: true })
      .then((imgData) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate image ratio
        const imgProps = new Image();
        imgProps.src = imgData;
        imgProps.onload = () => {
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          let heightLeft = imgHeight;
          let position = 0;

          // Add first page
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;

          // Add extra pages
          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
          }

          pdf.save("medical-history.pdf");
        };
      })
      .catch((err) => {
        console.error("Failed to generate PDF:", err);
      });
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
                      <p className="font-bold text-lg">{rec.weight || "N/A"}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Temperature</p>
                      <p className="font-bold text-lg">
                        {rec.temperature || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Heart Rate</p>
                      <p className="font-bold text-lg">
                        {rec.heart_rate || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-gray-600 text-sm">Resp. Rate</p>
                      <p className="font-bold text-lg">
                        {rec.resp_rate || "N/A"}
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

              <button
                onClick={downloadPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow ml-4 mb-4 "
              >
                Print
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
