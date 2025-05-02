import { useState } from "react";
import { formateDate } from "../../utils/formateDate";
import Prescriptions from "./Prescriptions";

const Appointments = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  const handlePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  if (showPrescriptionForm) {
    return (
      <div>
        <button
          onClick={() => setShowPrescriptionForm(false)}
          className="mb-4 text-primaryColor hover:underline"
        >
          ← Back to Appointments
        </button>
        <Prescriptions appointment={selectedAppointment} />
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">Name</th>
          <th scope="col" className="px-6 py-3">Gender</th>
          <th scope="col" className="px-6 py-3">Booked on</th>
          <th scope="col" className="px-6 py-3">prescription</th>
        </tr>
      </thead>

      <tbody>
        {appointments?.map(item => (
          <tr key={item._id}>
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
            >
              <img
                src={item.user.photo}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div className="pl-3">
                <div className="text-base font-semibold">{item.user.name}</div>
                <div className="text-normal text-gray-500">{item.user.email}</div>
              </div>
            </th>

            <td className="px-6 py-4">{item.user.gender}</td>
            <td className="px-6 py-4">{formateDate(item.createdAt)}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => handlePrescription(item)}
                className="text-primaryColor hover:underline"
              >
                Prescribe
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Appointments;
