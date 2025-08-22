import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Inbox = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState({});

  const handleReviewRequest = async (status, requestId) => {
    if (processing[requestId]) return; // Prevent double clicks

    try {
      setProcessing(prev => ({ ...prev, [requestId]: true }));
      
      // FIXED: Use requestId (which is request.id) and await the response
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      console.log(`Review ${status} successful:`, res.data);
      
      // Only remove if API call was successful
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(`Error ${status} request:`, err);
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/pending`, {
        withCredentials: true,
      });

      // console.log("Pending Req", res.data);

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return <h1 className="flex justify-center my-10 text-gray-400"> No Requests Found</h1>;

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="text-center text-white text-3xl font-bold mb-8">Connection Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          // FIXED: Use request.id as the unique key and for API calls
          const requestId = request.id;
          const { firstName, lastName, photo, age, gender, bio } = request.fromUserId;
          const isProcessing = processing[requestId];

          return (
            <div
              key={requestId} // FIXED: Use request.id as key
              className="flex justify-between items-center p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  src={photo}
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="text-left">
                  <h2 className="font-semibold text-xl text-white">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-gray-400">{age}, {gender}</p>
                  )}
                  {bio && <p className="text-gray-300 mt-1">{bio}</p>}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className={`px-5 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleReviewRequest("rejected", requestId)} // FIXED: Use requestId
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Reject'}
                </button>
                <button
                  className={`px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleReviewRequest("accepted", requestId)} // FIXED: Use requestId
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Accept'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inbox;
