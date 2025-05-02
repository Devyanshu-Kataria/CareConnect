"use client"

import { useState, useEffect } from "react"
import { BASE_URL } from "../../config"
import Loading from "../../components/Loader/Loading"
import Error from "../../components/Error/Error"
import { toast } from "react-toastify"
import useFetchData from "../../hooks/useFetchData"
import { formateDate } from "../../utils/formateDate"

const MyBookings = () => {
  const { data: bookings, loading, error } = useFetchData(`${BASE_URL}/bookings/my-bookings`)
  const { data: prescriptions } = useFetchData(`${BASE_URL}/documents/prescriptions/user`)

  // Default avatar as SVG
  const defaultAvatar = `data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0067FF"/><path d="M50 25C56.4107 25 61.6071 30.1964 61.6071 36.6071C61.6071 43.0179 56.4107 48.2143 50 48.2143C43.5893 48.2143 38.3929 43.0179 38.3929 36.6071C38.3929 30.1964 43.5893 25 50 25ZM50 62.5C66.5179 62.5 75 68.75 75 72.3214V75H25V72.3214C25 68.75 33.4821 62.5 50 62.5Z" fill="white"/></svg>')}`;

  useEffect(() => {
    if (bookings) {
      console.log("Bookings data:", bookings);
    }
  }, [bookings]);

  const getPrescriptionForBooking = (bookingId) => {
    return prescriptions?.find(p => p.booking._id === bookingId);
  };

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error errMessage={error} />
  }

  return (
    <div>
      {bookings?.length === 0 ? (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You haven't booked any appointments yet!
        </h2>
      ) : (
        <div className="grid gap-5">
          {bookings?.map((booking) => {
            const prescription = getPrescriptionForBooking(booking._id);
            return (
              <div
                key={booking._id}
                className="bg-white rounded-lg p-4 shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.doctor?.photo || defaultAvatar}
                      alt={booking.doctor?.name || "Doctor"}
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                        console.log("Failed to load doctor image for:", booking.doctor);
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-headingColor">
                        Dr. {booking.doctor?.name || "Unknown"}
                      </h3>
                      <p className="text-sm text-textColor">
                        {booking.doctor?.specialization || "Specialization not available"}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-textColor">
                          <span className="font-medium text-headingColor">Appointment:</span>{" "}
                          {formateDate(booking.appointmentDate)}
                        </p>
                        <p className="text-sm text-textColor">
                          <span className="font-medium text-headingColor">Booked on:</span>{" "}
                          {formateDate(booking.createdAt)}
                        </p>
                        <p className="text-sm text-textColor">
                          <span className="font-medium text-headingColor">Fee:</span>{" "}
                          ₹{booking.doctor?.ticketPrice || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Section */}
                  {prescription && (
                    <div className="bg-[#f5f5f5] p-4 rounded-lg flex-1">
                      <h4 className="text-lg font-semibold text-headingColor mb-2">
                        Prescription
                      </h4>
                      <div className="space-y-2">
                        {prescription.medicines.map((medicine, index) => (
                          <div key={index} className="bg-white p-3 rounded-md">
                            <p className="font-medium text-headingColor">
                              {medicine.name}
                            </p>
                            <p className="text-sm text-textColor">
                              Dosage: {medicine.dosage}
                            </p>
                            <p className="text-sm text-textColor">
                              Duration: {medicine.duration}
                            </p>
                            {medicine.instructions && (
                              <p className="text-sm text-textColor">
                                Instructions: {medicine.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                        {prescription.notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-headingColor">
                              Doctor's Notes:
                            </p>
                            <p className="text-sm text-textColor">
                              {prescription.notes}
                            </p>
                          </div>
                        )}
                        {prescription.prescriptionURL && (
                          <a
                            href={prescription.prescriptionURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-primaryColor hover:underline"
                          >
                            View Prescription Document
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
