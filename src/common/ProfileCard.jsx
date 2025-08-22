// ProfileCard.jsx
import React from "react";

const ProfileCard = ({ user }) => {
  const { firstName, lastName, age, gender, photo, bio, skills } = user;

  return (
    <div className="bg-base-300 w-80 shadow-xl rounded-2xl overflow-hidden relative">
      {/* Image */}
      <figure className="aspect-square w-full relative">
        <img
          src={
            photo ||
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
          }
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent" />
      </figure>

      {/* Details */}
      <div className="p-4 -mt-16 text-white relative z-10">
        <h2 className="text-2xl font-bold">
          {firstName} {lastName} {age ? `, ${age}` : ""}
        </h2>
        <p className="text-sm opacity-80">{gender || "Not specified"}</p>
        <p className="mt-2 text-sm">{bio || "No bio provided."}</p>

        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill, i) => (
              <span key={i} className="badge badge-outline badge-sm">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
