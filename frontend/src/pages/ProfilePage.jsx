import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchContacts();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setUser(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };
  

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get(`/api/sos/contacts/${user?._id}`);
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts", error);
      setContacts([]);
    }
  };

  const addEmergencyContact = async () => {
    try {
      await axios.post(`/api/sos/add-contact/${user?._id}`, { phoneNumber }, { withCredentials: true });
      fetchContacts();
    } catch (error) {
      console.error("Error adding contact", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/sos/delete-contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact", error);
    }
  };

  const sendSOS = async () => {
    if (!location.latitude || !location.longitude) {
      alert("Location not available!");
      return;
    }
    try {
      await axios.post(`/api/sos/send-sos/${user?._id}`, location);
      alert("SOS Sent!");
    } catch (error) {
      console.error("Error sending SOS", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 text-gray-900">
      <button className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded" onClick={() => navigate("/home")}>
        Home
      </button>
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        {user ? (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md mt-4">
        <h2 className="text-xl font-bold mb-4">Emergency Contacts</h2>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact._id} className="flex justify-between items-center border-b py-2">
              <p>{contact.phoneNumber}</p>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteContact(contact._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No emergency contacts added yet.</p>
        )}
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          placeholder="Add Contact Number"
          className="w-full p-2 border rounded mt-2"
        />
        <button className="w-full mt-2 bg-green-500 text-white p-2 rounded" onClick={addEmergencyContact}>Add Contact</button>
      </div>

      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md mt-4">
        <h2 className="text-xl font-bold mb-4">SOS Alert</h2>
        <button className="w-full bg-yellow-500 text-white p-2 rounded mb-2" onClick={getLocation}>Get Location</button>
        <button className="w-full bg-red-500 text-white p-2 rounded" onClick={sendSOS}>Send SOS</button>
      </div>
    </div>
  );
};

export default ProfilePage;