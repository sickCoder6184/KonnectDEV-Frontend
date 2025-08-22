import axios from "axios";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { addUser,removeUser } from "../utils/userSlice"; 

const NavBar = () => {
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter",
  ];

  const [activeTheme, setActiveTheme] = useState("light");
  
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch(); // ✅ fix
  const navigate = useNavigate();

  const changeTheme = (theme) => {
    document.querySelector("html").setAttribute("data-theme", theme);
    setActiveTheme(theme);
  };

  const handleLogOut = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });

      // clear redux user
      dispatch(removeUser(user));


      // redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Log Out Failed:", error);
    }
  };

  return (
    <div className="navbar sticky top-0 z-50 backdrop-blur-md bg-base-100/70 border-b border-base-300 px-6">
      {/* Brand */}
      <div className="flex-1">
        <Link
          to={"/"}
          className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary-focus transition"
        >
          KonnectDEV <span className="animate-pulse">🛜💓</span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex-none flex items-center gap-5">
        {/* Theme Switcher */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost gap-2 normal-case rounded-4xl"
          >
            🎨 Theme
          </label>
          <div
            tabIndex={0}
            className="dropdown-content z-[1] mt-3 w-64 p-2 bg-base-100 shadow-xl rounded-b-2xl grid grid-cols-2 gap-2 max-h-80 overflow-y-auto"
          >
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => changeTheme(theme)}
                className={`flex items-center justify-center p-2 rounded-4xl text-sm capitalize transition-all ${
                  activeTheme === theme
                    ? "bg-primary text-primary-content font-semibold shadow-sm"
                    : "hover:bg-base-200"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar */}
        {user && (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar border border-base-300 hover:scale-105 transition-transform"
            >
              <div className="w-10 rounded-full">
                <img alt="User avatar" src={user.photo} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-[1] mt-3 w-56 p-3 shadow-lg"
            >
              <li className="mb-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition">
                  <img
                    src={user.photo}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.emailId}</p>
                  </div>
                </div>
              </li>
              <li>
                <Link to={"/profile"} className="hover:bg-base-200 rounded-lg">
                  Profile {user.gender === "male" ? "🧑" : "👧"}
                </Link>
              </li>
              <li>
                <Link
                  to={"/myConnections"}
                  className="hover:bg-base-200 rounded-lg"
                >
                  My Connection 🤝
                </Link>
              </li>
              <li>
                <Link
                  to={"/pendingRequests"}
                  className="hover:bg-base-200 rounded-lg"
                >
                  Inbox 🔔
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogOut}
                  className="w-full text-left hover:bg-error rounded-lg font-bold font-stretch-125% text-accent"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
