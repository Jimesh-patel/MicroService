import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { toast } from "react-toastify";

const CaptainSignup = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
      paymentId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Internal Server Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-around items-center">
      
      <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row md:gap-6">
        <div className="flex-1">
          <div className="w-full flex mb-6">
            <img className="w-36 -ml-2" src="Logo.png" alt="Logo" />
          </div>
          <h3 className="text-lg font-medium mb-2">Captain's Name</h3>
          <div className="flex gap-4 mb-7">
            <input required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <h3 className="text-lg font-medium mb-2">Email</h3>
          <input required className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h3 className="text-lg font-medium mb-2">Password</h3>
          <input required className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="flex-1 flex flex-col justify-center mt-9">
          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" type="text" placeholder="Vehicle Color" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
            <input required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" type="text" placeholder="Vehicle Plate" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
          </div>
          <div className="flex gap-4 mb-7">
            <input required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" type="number" placeholder="Vehicle Capacity" value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
            <select required className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="" disabled hidden>Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <h3 className="text-lg font-medium mb-2">Payment ID</h3>
          <input required className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" type="text" placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full max-w-md text-lg" disabled={loading}>{loading ? "Signing up..." : "Create Captain Account"}</button>
      <p className="text-center pb-5">Already have an account? <Link to="/captain-login" className="text-blue-600">Login here</Link></p>
    </div>
  );
};

export default CaptainSignup;