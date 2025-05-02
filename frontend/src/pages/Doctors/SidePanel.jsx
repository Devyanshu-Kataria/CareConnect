"use client"

import { useState } from "react"
import convertTime from "../../utils/convertTime"
import { BASE_URL } from "./../../config"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const SidePanel = ({ doctorId, timeSlots, ticketPrice }) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState("")
  const [loading, setLoading] = useState(false)

  const bookingHandler = async () => {
    try {
      if (!selectedDate) {
        toast.error("Please select an appointment date")
        return
      }

      // Get token from localStorage
      const token = localStorage.getItem("token")
      
      // Check if user is authenticated
      if (!token) {
        toast.error("Please login to book an appointment")
        navigate("/login")
        return
      }

      setLoading(true)

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId,
          appointmentDate: selectedDate
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error booking appointment")
      }

      toast.success("Appointment booked successfully!")
      navigate("/users/profile/me")
      
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date in input
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="mb-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Consultation Fee:
        </p>
        <p className="text-[28px] font-bold text-headingColor mt-2">
          ₹{ticketPrice}
        </p>
        <p className="text-[14px] text-textColor">
          (Per Consultation Session)
        </p>
      </div>

      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Select Appointment Date:
        </p>
        <input
          type="date"
          className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor mt-2 rounded-md"
          min={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </div>

      <button
        onClick={bookingHandler}
        disabled={loading}
        className={`btn px-2 w-full rounded-md mt-5 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </div>
  )
}

export default SidePanel
