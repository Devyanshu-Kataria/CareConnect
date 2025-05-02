// import { useState, useEffect } from "react";
// import DoctorCard from "./../../components/Doctors/DoctorCard";
// import Testimonial from "../../components/Testimonial/Testimonial";
// import { BASE_URL } from "./../../config";
// import useFetchData from "./../../hooks/useFetchData";
// import Loading from "../../components/Loader/Loading";
// import Error from "../../components/Error/Error";
// import {doctorss} from './../../assets/data/doctors';

// const Doctors = () => {
//   const [query, setQuery] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearchResults, setShowSearchResults] = useState(false);

//   const handleSearch = () => {
//     const trimmedQuery = query.trim();
//     setSearchQuery(trimmedQuery);
//     setShowSearchResults(!!trimmedQuery); // Only show search results if there's a query
//   };

//   // Handle enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Get all doctors from API when not searching
//   const { data: apiDoctors, loading: apiLoading, error: apiError } = useFetchData(
//     `${BASE_URL}/doctors`
//   );

//   // Get searched doctors when searching
//   const { data: searchedDoctors, loading: searchLoading, error: searchError } = useFetchData(
//     showSearchResults ? `${BASE_URL}/doctors?query=${searchQuery}` : null
//   );

//   const loading = searchLoading || apiLoading;
//   const error = searchError || apiError;

//   return (
//     <>
//       <section className="bg-[#fff9ea]">
//         <div className="container text-center">
//           <h2 className="heading">Find a Doctor</h2>
//           <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
//             <input
//               type="search"
//               className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
//               placeholder="Search doctor by name or speciality"
//               value={query}
//               onChange={e => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button 
//               className="btn mt-0 rounded-[0px] rounded-r-md" 
//               onClick={handleSearch}
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           {loading && <Loading />}
//           {error && <Error errMessage={error} />}
          
//           {/* Show search results if there's a search query */}
//           {showSearchResults && !loading && !error && (
//             <>
//               {searchedDoctors && searchedDoctors.length === 0 ? (
//                 <h3 className="text-center text-[20px] leading-[30px] text-primaryColor font-[600] mt-5">
//                   No doctors found for your search criteria
//                 </h3>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                   {searchedDoctors?.map(doctor => (
//                     <DoctorCard key={doctor._id} doctor={doctor} />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {/* Show all doctors if there's no search happening */}
//           {!showSearchResults && !loading && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//               {/* Show local doctors */}
//               {doctorss.map(doctor => (
//                 <DoctorCard key={doctor.id} doctor={doctor} />
//               ))}
//               {/* Show API doctors */}
//               {apiDoctors?.map(doctor => (
//                 <DoctorCard key={doctor._id} doctor={doctor} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="xl:w-[470px] mx-auto">
//             {/* <h2 className="heading text-center">What our patient say</h2> */}
//             <p className="text_para text-center">
//               World-class care for everyone. Our health system offers unmatched, expert health care.
//             </p>
//           </div>
//           <Testimonial />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Doctors;

import { useState, useEffect } from "react";
import DoctorCard from "./../../components/Doctors/DoctorCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { doctorss } from './../../assets/data/doctors';

const Doctors = () => {
  // Get all doctors from the API
  const { data: apiDoctors, loading: apiLoading, error: apiError } = useFetchData(
    `${BASE_URL}/doctors`
  );

  const loading = apiLoading;
  const error = apiError;

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h3 className="heading">Find a Doctor</h3>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loading />}
          {error && <Error errMessage={error} />}
          
          {/* Show all doctors (local + API) */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {/* Show local doctors */}
              {doctorss.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
              {/* Show API doctors */}
              {apiDoctors?.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <p className="text_para text-center">
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctors;

