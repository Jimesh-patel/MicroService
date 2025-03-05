import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { toast } from "react-toastify";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  // Send OTP API call
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/send-otp`,
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

    const otpCode = otp.join("");
    console.log(otpCode);
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/verify-otp`,
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

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      phone: phoneNumber,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      console.log(response.data);

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
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
        `${import.meta.env.VITE_BASE_URL}/users/resend-otp`,
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

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Render signup form
  const renderSignupForm = () => (
    <div className="p-7 h-screen flex flex-col justify-around items-center">
      <div className="w-full max-w-md mx-auto flex flex-col">
        <div className="flex mb-10 -ml-2">
          <img className="w-36" src="Logo.png" alt="Logo" />
        </div>
        <form className="w-full" onSubmit={sendOTP}>
          <h3 className="text-lg font-medium mb-2 mt-5">What's your name</h3>
          <div className="flex gap-4 mb-7 w-full">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Phone Number</h3>
          <input
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="tel"
            placeholder="+1234567890"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base my-5"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
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
            type="button"
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
    <div>
      {!otpSent ? renderSignupForm() : renderOTPForm()}
    </div>
  );
};

export default UserSignup;