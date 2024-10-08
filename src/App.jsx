import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API = "https://66e7e68bb17821a9d9da6e50.mockapi.io/login";
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.get(API).then((res) => {
      const user = res.data.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        setIsAuthenticated(true);
        const userData = {
          name: user.name,
          username: user.username,
          profileImage: user.profileImage,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/homepage");
      } else {
        setErrorMessage("Invalid login credentials. Please try again.");
      }
    });
  };

  return (
    <body className="bg-[#1d232a]">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 sm:p-12 lg:p-16 bg-black border border-gray-900 rounded-2xl m-3">
          <div className="text-center space-y-6">
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

            <h1 className="text-white text-2xl font-semibold">
              Login to Continue
            </h1>

            <input
              type="text"
              className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-700 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full p-3 bg-gray-50 rounded-full font-bold text-gray-900 border border-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Login
            </button>

            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}

            <p className="text-white">
              Don’t have an account?{" "}
              <span
                className="font-semibold text-sky-700 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
