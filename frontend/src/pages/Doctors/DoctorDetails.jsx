import { useState, useEffect } from "react";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { useParams } from "react-router-dom";
import { doctorss } from "../../assets/data/doctors";

const DoctorDetails = () => {
  const [tab, setTab] = useState('about');
  const { id } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  // Try to find the doctor in local data first
  const localDoctor = doctorss.find(doc => doc.id === id);

  // Only fetch from API if not found locally
  const { data: apiDoctor, loading, error } = useFetchData(
    !localDoctor ? `${BASE_URL}/doctors/${id}` : null,
    refreshKey // Add this as a dependency to trigger refetch
  );

  // Use either local or API doctor data
  const doctor = localDoctor || apiDoctor;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <Loading />;
  if (error) return <Error errMessage={error} />;
  if (!doctor) return <Error errMessage="Doctor not found" />;

  const {
    name = '',
    qualifications = [],
    experiences = [],
    timeSlots = [],
    reviews = [],
    bio = '',
    about = '',
    averageRating = 0,
    avgRating = 0,
    totalRating = 0,
    specialization = '',
    ticketPrice = 0,
    photo = '',
  } = doctor;

  // Use either averageRating or avgRating
  const rating = averageRating || avgRating || 0;

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className="max-w-[200px] max-h-[200px]">
                <img src={photo} alt={name} className="w-full" />
              </figure>
              <div>
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                  {specialization}
                </span>
                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                  {name}
                </h3>
                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                    <img src={starIcon} alt="" />{rating}
                  </span>
                  <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                    ({totalRating})
                  </span>
                </div>
                <p className="text_para text-[14px] leading-5 md:text-[15px] lg:max-w-[390px]">
                  {bio}
                </p>
              </div>
            </div>

            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button
                onClick={() => setTab('about')}
                className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => setTab('feedback')}
                className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>
            </div>

            <div className="mt-[50px]">
              {tab === 'about' && (
                <DoctorAbout
                  name={name}
                  about={about}
                  qualifications={qualifications}
                  experiences={experiences}
                />
              )}

              {tab === 'feedback' && (
                <Feedback 
                  reviews={reviews} 
                  totalRating={totalRating} 
                  onRefresh={handleRefresh}
                />
              )}
            </div>
          </div>
          <div>
            <SidePanel 
              doctorId={id}
              ticketPrice={ticketPrice}
              timeSlots={timeSlots}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
