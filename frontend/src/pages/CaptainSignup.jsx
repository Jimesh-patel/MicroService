import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { toast } from "react-toastify";

const CaptainSignup = () => {
  const navigate = useNavigate();
  
  // Signup form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);

  const { setCaptain } = React.useContext(CaptainDataContext);

  // Send OTP API call
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/send-otp`,
        { phone: phoneNumber }
      );

      if (response.status === 200) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Register
  const verifyOTPAndRegister = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    // Combine OTP digits
    const otpCode = otp.join("");

    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/verify-otp`,
        { phone: phoneNumber, otp: otpCode }
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to verify OTP";
      toast.error(message);
      setOtpLoading(false);
      return;
    }

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      phoneNumber,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
      paymentId,
      phone: phoneNumber,
      
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
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setOtpLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/resend-otp`,
        { phone: phoneNumber }
      );

      if (response.status === 200) {
        toast.success("OTP resent successfully");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Render signup form
  const renderSignupForm = () => (
    <div className="p-7 h-screen flex flex-col justify-around items-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row md:gap-6">
        <div className="flex-1">
          <div className="w-full flex mb-6">
            <img className="w-36 -ml-2" src="Logo.png" alt="Logo" />
          </div>
          <h3 className="text-lg font-medium mb-2">Captain's Name</h3>
          <div className="flex gap-4 mb-7">
            <input 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              type="text" 
              placeholder="First name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
            />
            <input 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              type="text" 
              placeholder="Last name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
            />
          </div>

          <h3 className="text-lg font-medium mb-2">Email</h3>
          <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" 
            type="email" 
            placeholder="email@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <h3 className="text-lg font-medium mb-2">Phone Number</h3>
          <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" 
            type="tel" 
            placeholder="+1234567890" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />

          <h3 className="text-lg font-medium mb-2">Password</h3>
          <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div className="flex-1 flex flex-col justify-center mt-9">
          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              type="text" 
              placeholder="Vehicle Color" 
              value={vehicleColor} 
              onChange={(e) => setVehicleColor(e.target.value)} 
            />
            <input 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              type="text" 
              placeholder="Vehicle Plate" 
              value={vehiclePlate} 
              onChange={(e) => setVehiclePlate(e.target.value)} 
            />
          </div>
          <div className="flex gap-4 mb-7">
            <input 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              type="number" 
              placeholder="Vehicle Capacity" 
              value={vehicleCapacity} 
              onChange={(e) => setVehicleCapacity(e.target.value)} 
            />
            <select 
              required 
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg" 
              value={vehicleType} 
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled hidden>Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <h3 className="text-lg font-medium mb-2">Payment ID</h3>
          <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg" 
            type="text" 
            placeholder="Payment ID" 
            value={paymentId} 
            onChange={(e) => setPaymentId(e.target.value)} 
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full max-w-md text-lg" 
        onClick={sendOTP} 
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      <p className="text-center pb-5">
        Already have an account? <Link to="/captain-login" className="text-blue-600">Login here</Link>
      </p>
    </div>
  );

  // Render OTP verification form
  const renderOTPForm = () => (
    <div className="p-7 h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        <div className="w-full flex mb-6 justify-center">
          <img className="w-36" src="Logo.png" alt="Logo" />
        </div>
        <h3 className="text-lg font-medium mb-4 text-center">
          Enter OTP sent to {phoneNumber}
        </h3>
        
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-2xl border rounded-lg bg-[#eeeeee]"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <button 
            className="text-blue-600 hover:underline"
            onClick={resendOTP}
            disabled={otpLoading}
          >
            Resend OTP
          </button>
        </div>

        <button 
          type="submit" 
          className="bg-[#111] text-white font-semibold rounded-lg px-4 py-2 w-full text-lg" 
          onClick={verifyOTPAndRegister}
          disabled={otpLoading || otp.some(digit => digit === "")}
        >
          {otpLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );

  return (
    <form>
      {!otpSent ? renderSignupForm() : renderOTPForm()}
    </form>
  );
};

export default CaptainSignup;
