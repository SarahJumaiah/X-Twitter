import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const API = "https://66e7e68bb17821a9d9da6e50.mockapi.io/login";

  const handleSignup = () => {
    if (!name || !username || !password || !email || !profileImage) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    axios
      .post(API, { name, username, password, email, profileImage })
      .then((res) => {
        const userData = {
          name: res.data.name,
          username: res.data.username,
          profileImage: res.data.profileImage,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage("Signup failed. Please try again.");
      });
  };

  return (
    <body className="bg-[#1d232a]">
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-black border border-gray-900 rounded-2xl p-8">
          <svg
            viewBox="0 0 24 24"
            aria-label="X"
            role="img"
            className="h-20 fill-white mx-auto"
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
          <div className="flex items-center justify-center">
            <h1 className="text-white text-2xl font-semibold">Sign up</h1>
          </div>

          <div className="space-y-6">
            <input
              className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Profile Image URL"
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />

            <button
              onClick={handleSignup}
              className="w-full p-3 bg-gray-50 rounded-full font-bold text-gray-900 border border-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Sign Up
            </button>

            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}

            <p className="text-white text-center">
              Already have an account?{" "}
              <span
                className="font-semibold text-sky-700 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
}
