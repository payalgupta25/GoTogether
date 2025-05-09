// import React, { useEffect, useState } from "react";
// import { useLocation , Link} from "react-router-dom";
// import axios from "axios";
// import { MapPin, Send } from "lucide-react";


// const AllRides = () => {
//   const location = useLocation();
//   const [rides, setRides] = useState(location.state?.rides || []);
//   const [filteredRides, setFilteredRides] = useState([]);
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   useEffect(() => {
//     if (rides.length === 0) {
//       const fetchRides = async () => {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/all`);
//           setRides(response.data);
//           setFilteredRides(response.data);
//         } catch (error) {
//           console.error("Error fetching rides:", error);
//         }
//       };
//       fetchRides();
//     } else {
//       setFilteredRides(rides);
//     }
//   }, [rides]);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/filter`, {
//         from,
//         to,
//       });
//       setFilteredRides(response.data);
//     } catch (error) {
//       console.error("Error filtering rides:", error);
//     }
//   };
  

//   useEffect(() => {
//     if (!from && !to) {
//       setFilteredRides(rides);
//     } else {
//       const filtered = rides.filter((ride) =>
//         ride.from.toLowerCase().includes(from.toLowerCase()) &&
//         ride.to.toLowerCase().includes(to.toLowerCase())
//       );
//       setFilteredRides(filtered);
//     }
//   }, [from, to, rides]);

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-xl mb-6">
//         <div className="relative w-full md:w-1/3">
//           <MapPin className="absolute left-3 top-3 text-gray-600" />
//           <input
//             type="text"
//             placeholder="Pickup location"
//             value={from}
//             onChange={(e) => setFrom(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
//           <Send className="absolute left-3 top-3 text-gray-600" />
//           <input
//             type="text"
//             placeholder="Destination"
//             value={to}
//             onChange={(e) => setTo(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={handleSearch}
//           className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition mt-4 md:mt-0"
//         >
//           Search
//         </button>
//       </div>

//       {filteredRides.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
//           {filteredRides.map((ride) => (
//             <div key={ride._id} className="bg-white p-6 rounded-lg shadow-md">
//               <h1 className="text-lg font-bold text-gray-900">{ride.driver?.name}</h1>
//               <h2 className="text-md text-gray-700">{ride.from} ➝ {ride.to}</h2>
//               <p className="text-sm text-gray-600">Date: {new Date(ride.date).toLocaleDateString()}</p>
//               <p className="text-sm text-gray-600">Seats Available: {ride.numberOfMembers}</p>
//               <p className="font-bold text-blue-700">₹{ride.price}</p>
//               <ul>
//                 {ride.passengers.map((passenger) => (
//                   <li key={passenger._id} className="text-gray-600">{passenger.name}</li>
//                 ))}
//               </ul>
//               <button className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
//                 <Link to={`/ride/${ride._id}`}>View Details</Link>
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-900 text-lg">Oops! No rides available.</p>
//       )}
//     </div>
//   );
// };

// export default AllRides;


// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import axios from "axios";
// import { MapPin, Send } from "lucide-react";

// const AllRides = () => {
//   const location = useLocation();
//   const [rides, setRides] = useState(location.state?.rides || []);
//   const [filteredRides, setFilteredRides] = useState([]);
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   // Initial fetch (if no rides passed via location)
//   useEffect(() => {
//     const fetchRides = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/all`);
//         setRides(response.data);
//         setFilteredRides(response.data);
//       } catch (error) {
//         console.error("Error fetching rides:", error);
//       }
//     };

//     if (rides.length === 0) {
//       fetchRides();
//     } else {
//       setFilteredRides(rides);
//     }
//   }, [rides]);

//   // Frontend live filtering as user types
//   useEffect(() => {
//     if (!from && !to) {
//       setFilteredRides(rides);
//     } else {
//       const filtered = rides.filter((ride) =>
//         ride.from.toLowerCase().includes(from.toLowerCase()) &&
//         ride.to.toLowerCase().includes(to.toLowerCase())
//       );
//       setFilteredRides(filtered);
//     }
//   }, [from, to, rides]);

//   // Server-side filtering when user clicks search or presses enter
//   const handleSearch = async () => {
//     try {
//       let response;
//       if (!from && !to) {
//         response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/all`);
//       } else {
//         response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/filter`, {
//           from,
//           to,
//         });
//       }
//       setFilteredRides(response.data);
//     } catch (error) {
//       console.error("Error filtering rides:", error);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       {/* Search Inputs */}
//       <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-xl mb-6">
//         <div className="relative w-full md:w-1/3">
//           <MapPin className="absolute left-3 top-3 text-gray-600" />
//           <input
//             type="text"
//             placeholder="Pickup location"
//             value={from}
//             onChange={(e) => setFrom(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
//           <Send className="absolute left-3 top-3 text-gray-600" />
//           <input
//             type="text"
//             placeholder="Destination"
//             value={to}
//             onChange={(e) => setTo(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={handleSearch}
//           className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition mt-4 md:mt-0"
//         >
//           Search
//         </button>
//       </div>

//       {/* Rides List */}
//       {filteredRides.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
//           {filteredRides.map((ride) => (
//             <div key={ride._id} className="bg-white p-6 rounded-lg shadow-md">
//               <h1 className="text-lg font-bold text-gray-900">{ride.driver?.name}</h1>
//               <h2 className="text-md text-gray-700">{ride.from} ➝ {ride.to}</h2>
//               <p className="text-sm text-gray-600">Date: {new Date(ride.date).toLocaleDateString()}</p>
//               <p className="text-sm text-gray-600">Seats Available: {ride.numberOfMembers}</p>
//               <p className="font-bold text-blue-700">₹{ride.price}</p>
//               <ul>
//                 {ride.passengers.map((passenger) => (
//                   <li key={passenger._id} className="text-gray-600">{passenger.name}</li>
//                 ))}
//               </ul>
//               <Link to={`/ride/${ride._id}`}>
//                 <button className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
//                   View Details
//                 </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-900 text-lg">Oops! No rides available.</p>
//       )}
//     </div>
//   );
// };

// export default AllRides;


import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Send } from "lucide-react";

const AllRides = () => {
  const location = useLocation();
  const [rides, setRides] = useState(location.state?.rides || []);
  const [filteredRides, setFilteredRides] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/all`);
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    if (rides.length === 0) {
      fetchRides();
    } else {
      setFilteredRides(rides);
    }
  }, [rides]);

  useEffect(() => {
    let updated = [...rides];

    if (from) {
      updated = updated.filter((ride) =>
        ride.from.toLowerCase().includes(from.toLowerCase())
      );
    }

    if (to) {
      updated = updated.filter((ride) =>
        ride.to.toLowerCase().includes(to.toLowerCase())
      );
    }

    if (maxPrice) {
      updated = updated.filter((ride) => ride.price <= parseFloat(maxPrice));
    }

    if (minSeats) {
      updated = updated.filter((ride) => ride.numberOfMembers >= parseInt(minSeats));
    }

    if (selectedDate) {
      updated = updated.filter(
        (ride) => new Date(ride.date).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredRides(updated);
  }, [from, to, maxPrice, minSeats, selectedDate, rides]);

  const handleSearch = () => {
    // Filtering is already applied live with useEffect
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-xl mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/3">
            <MapPin className="absolute left-3 top-3 text-gray-600" />
            <input
              type="text"
              placeholder="Pickup location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full md:w-1/3">
            <Send className="absolute left-3 top-3 text-gray-600" />
            <input
              type="text"
              placeholder="Destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-100 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Minimum Seats"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition w-full md:w-auto"
        >
          Apply Filters
        </button>
      </div>

      {filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {filteredRides.map((ride) => (
            <div key={ride._id} className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-lg font-bold text-gray-900">{ride.driver?.name}</h1>
              <h2 className="text-md text-gray-700">{ride.from} ➝ {ride.to}</h2>
              <p className="text-sm text-gray-600">Date: {new Date(ride.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Seats Available: {ride.numberOfMembers}</p>
              <p className="font-bold text-blue-700">₹{ride.price}</p>
              <ul>
                {ride.passengers?.map((p) => (
                  <li key={p._id} className="text-gray-600">{p.name}</li>
                ))}
              </ul>
              <Link to={`/ride/${ride._id}`}>
                <button className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-900 text-lg mt-4">Oops! No rides match your filters.</p>
      )}
    </div>
  );
};

export default AllRides;
