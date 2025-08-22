import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const Card = ({ user }) => {
  const { firstName, lastName, age, gender, photo, bio, skills, _id } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ interested: false, ignored: false });

  const handleReq = async (status, userId) => {
    // Prevent double clicks
    if (loading[status]) return;

    try {
      setLoading(prev => ({ ...prev, [status]: true }));
      
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      console.log(`${status} request sent:`, res.data);
      
      // Remove user from feed after successful request
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(`Error sending ${status} request:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [status]: false }));
    }
  };

  return (
    <div className="p-6">
      <div className="card bg-base-300 w-80 shadow-lg rounded-2xl overflow-hidden relative group">
        {/* Image section (square ratio 1:1 with bottom gradient overlay) */}
        <figure className="aspect-square w-full relative">
          <img
            src={
              photo ||
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
            }
            alt={`${firstName || "User"} ${lastName || ""}`}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay with hover effect */}
          <div
            className="absolute bottom-0 left-0 w-full h-full 
                       bg-gradient-to-t from-black/40 to-transparent
                       opacity-100 group-hover:opacity-0 
                       transition-opacity duration-500"
          ></div>
        </figure>

        {/* Card Body */}
        <div className="card-body p-4 relative z-10 -mt-16 text-white">
          <h2 className="card-title text-lg">
            {firstName || "First"} {lastName || "Last"}
            {age ? `, ${age}` : ""}
          </h2>
          <p className="text-sm opacity-90">
            {gender || "Gender not specified"}
          </p>
          <p className="text-sm mt-2">{bio || "No bio added yet..."}</p>

          {/* Skills (chips) */}
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-outline text-xs bg-white/10"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}

          {/* Buttons Section - Only in Card component */}
          <div className="grid grid-cols-2 gap-2 p-4">
            <button
              className={`btn btn-sm btn-primary ${
                loading.interested ? 'loading opacity-70' : ''
              }`}
              onClick={() => handleReq("interested", _id)}
              disabled={loading.interested || loading.ignored}
            >
              {loading.interested ? 'Sending...' : 'Interested'}
            </button>
            <button
              className={` btn btn-sm btn-secondary ${
                loading.ignored ? 'loading opacity-70' : ''
              }`}
              onClick={() => handleReq("ignored", _id)}
              disabled={loading.interested || loading.ignored}
            >
              {loading.ignored ? 'Sending...' : 'Ignore'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
