import { useState } from "react";
import { BASE_URL } from "../../config";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { toast } from "react-toastify";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFetchData from "../../hooks/useFetchData";
import { formateDate } from "../../utils/formateDate";

const Prescriptions = ({ appointment }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
    notes: ""
  });

  const { data: prescriptions, loading: prescriptionsLoading, error, refetch } = 
    useFetchData(`${BASE_URL}/documents/prescriptions/doctor`);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][field] = value;
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: "", duration: "", instructions: "" }
      ]
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prescriptionURL = await uploadImageToCloudinary(selectedFile);

      const res = await fetch(`${BASE_URL}/documents/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          patientId: appointment.user._id,
          bookingId: appointment._id,
          prescriptionURL,
          ...formData
        }),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      toast.success(message);
      setFormData({
        medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
        notes: ""
      });
      setSelectedFile(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (prescriptionsLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error errMessage={error} />;
  }

  return (
    <div className="max-w-[1170px] px-5 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        {/* Upload Form */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>
          <form onSubmit={handleSubmit}>
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Medicine {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicine}
              className="mb-4 text-primaryColor hover:underline"
            >
              + Add Another Medicine
            </button>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Prescription (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primaryColor text-white py-2 px-4 rounded-md hover:bg-primaryDark transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Prescription"}
            </button>
          </form>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Prescriptions History</h2>
          {prescriptions?.length === 0 ? (
            <p className="text-gray-500">No prescriptions created yet.</p>
          ) : (
            <div className="space-y-4">
              {prescriptions?.map((prescription) => (
                <div
                  key={prescription._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={prescription.patient.photo}
                      alt={prescription.patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {prescription.patient.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Appointment: {formateDate(prescription.booking.appointmentDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">Medicines:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {prescription.medicines.map((medicine, index) => (
                        <li key={index}>
                          <span className="font-medium">{medicine.name}</span> - {medicine.dosage}
                          <br />
                          <span className="text-sm text-gray-600">
                            Duration: {medicine.duration}
                            {medicine.instructions && ` | ${medicine.instructions}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {prescription.notes && (
                    <div className="mt-3">
                      <h4 className="font-medium mb-2">Notes:</h4>
                      <p className="text-sm text-gray-600">{prescription.notes}</p>
                    </div>
                  )}
                  {prescription.prescriptionURL && (
                    <a
                      href={prescription.prescriptionURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-primaryColor hover:underline"
                    >
                      View Prescription Document
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions; 