import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    mobile: "",
    email: "",
    password: "",
    stream: "",
    major: "",
    otp: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtp = () => {
    if (!form.email && !form.mobile) {
      alert("Please enter Email or Mobile first!");
      return;
    }
    alert("OTP sent successfully!");
    setOtpSent(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) return alert("Please verify OTP first!");
    console.log("Registration Data:", form);
    alert("Registration successful!");
    navigate("/login");
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm md:max-w-lg mt-10">
        <h2 className="text-xl font-bold text-center text-black mb-4">CareerCompass Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            name="stream"
            value={form.stream}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Education Stream</option>
            <option>Science</option>
            <option>Commerce</option>
            <option>Arts</option>
            <option>Engineering</option>
            <option>Management</option>
            <option>Computer Science</option>
          </select>

          <input
            type="text"
            name="major"
            placeholder="Major :Eg.-Computer Science,Marketing"
            value={form.major}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              type="button"
              onClick={handleOtp}
              className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 text-sm"
            >
              {otpSent ? "Resend" : "Send OTP"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"       >
            Register
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
