// Card.jsx (DaisyUI Version)
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import ProfileCard from "./ProfileCard";
import { Heart, X, MapPin, Sparkles } from "lucide-react";

const Card = ({ user }) => {
  const { _id } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({
    interested: false,
    ignored: false,
  });
  const [isFlipping, setIsFlipping] = useState(false);

  const handleReq = async (status, userId) => {
    if (loading[status] || isFlipping) return;

    setLoading((prev) => ({ ...prev, [status]: true }));
    setIsFlipping(true);

    setTimeout(async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/request/send/${status}/${userId}`,
          {},
          { withCredentials: true }
        );

        console.log(`${status} request sent:`, res.data);

        // remove from redux feed (pass id string)
        dispatch(removeUserFromFeed(userId));
      } catch (err) {
        console.error(`Error sending ${status} request:`, err);
      } finally {
        // stop loading + flip state after request completes
        setLoading((prev) => ({ ...prev, [status]: false }));
        setIsFlipping(false);
      }
    }, 300);
  };

  return (
    <div className="relative group">
      <ProfileCard 
        user={user} 
        className={`
          ${isFlipping ? 'animate-pulse scale-95' : ''}
          hover:rotate-1 transition-transform duration-500
        `}
      >
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Ignore Button */}
          <button
            onClick={() => handleReq("ignored", _id)}
            disabled={loading.ignored || loading.interested || isFlipping}
            className={`
              btn btn-circle btn-lg
              ${loading.ignored || loading.interested || isFlipping 
                ? 'btn-disabled' 
                : 'btn-error hover:btn-error'
              }
              shadow-lg hover:shadow-xl
              transform hover:scale-110 active:scale-95
              transition-all duration-300 ease-out
              group/btn
            `}
          >
            {loading.ignored ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <X className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-200" />
            )}
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleReq("interested", _id)}
            disabled={loading.interested || loading.ignored || isFlipping}
            className={`
              btn btn-circle btn-lg
              ${loading.interested || loading.ignored || isFlipping 
                ? 'btn-disabled' 
                : 'btn-primary hover:btn-secondary'
              }
              shadow-xl hover:shadow-2xl
              transform hover:scale-115 active:scale-95
              transition-all duration-300 ease-out
              relative overflow-hidden
              group/btn
            `}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            
            {loading.interested ? (
              <span className="loading loading-spinner loading-md relative z-10"></span>
            ) : (
              <>
                <Heart className="w-7 h-7 relative z-10 group-hover/btn:scale-110 group-hover/btn:fill-current transition-all duration-200" />
                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent opacity-0 group-hover/btn:opacity-100 animate-pulse transition-opacity duration-300 z-10" />
              </>
            )}
          </button>
        </div>

       
      </ProfileCard>

      {/* Processing Overlay */}
      {isFlipping && (
        <div className="absolute inset-0 bg-base-300/20 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50 card">
          <div className="bg-base-100 p-4 rounded-2xl shadow-xl border border-base-300">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm text-primary"></span>
              <span className="text-base-content font-medium text-sm">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;