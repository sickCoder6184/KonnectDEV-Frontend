// ProfileCard.jsx (DaisyUI Version)
import React from "react";

const ProfileCard = ({ user, className = "", children }) => {
  const { firstName, lastName, age, gender, photo, bio, skills } = user;

  return (
    <div
      className={`
        card card-lg w-full max-w-sm mx-auto
        bg-base-100 shadow-xl
        hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300 ease-out
        border border-base-300/20
        ${className}
      `}
    >
      {/* Profile Image Container */}
      <figure className="relative h-80 overflow-hidden">
        {/* Image Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        
        {photo ? (
          <img
            src={photo}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <div className="w-24 h-24 bg-base-100/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Floating Age Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="badge badge-lg badge-primary badge-outline bg-base-100/90">
            <span className="font-semibold">{age}</span>
          </div>
        </div>
        
        {/* Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h2 className=" text-2xl font-bold mb-2 drop-shadow-lg">
            {firstName} {lastName}
          </h2>
          <div className="flex items-center gap-2">
            <div className="badge badge-sm bg-base-100/20 backdrop-blur-sm  border-0">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse mr-1" />
              {gender || "Not specified"}
            </div>
          </div>
        </div>
      </figure>
      
      {/* Card Body */}
      <div className="card-body">
        {/* Bio */}
        <div className="space-y-2">
          <p className=" text-base-content/80 text-sm leading-relaxed line-clamp-3 ">
            {bio || "No bio provided."}
          </p>
        </div>
        
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-base-content font-semibold text-sm">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-primary badge-outline hover:badge-primary transition-colors duration-200 font-bold"
                >
                  {skill}
                </div>
              ))}
              {skills.length > 4 && (
                <div className="badge badge-neutral">
                  +{skills.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Custom Children Content */}
        {children && (
          <div className="card-actions pt-4 border-t border-base-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;