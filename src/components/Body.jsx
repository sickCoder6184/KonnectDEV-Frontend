import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { BASE_URL } from "../utils/constant";
import { addUser, removeUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;

    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });

      // backend may return either `{ data: user }` or `user` directly
      const user = res.data?.data || res.data;
      if (user) {
        // loggedIN user conatins data adding to it
        dispatch(addUser(user));
      } else {
        // if no user returned treat as unauthenticated
        dispatch(removeUser());
        navigate("/login");
      }
    } catch (error) {
      console.error(" Failed to fetch user:", error);

      // Use error.response?.status to detect 401
      if (error.response?.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUser();
    // run again if userData changes (so we don't refetch unnecessarily)
  }, [userData]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
