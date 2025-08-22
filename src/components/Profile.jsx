import React from "react";
import EditProfile from "../common/EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user); // ✅ Corrected

  return (
    user && (
      <div className="p-6 ">
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
