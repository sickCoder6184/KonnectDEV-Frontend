import React, { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from 'react-router-dom';

const MyConnections = () => {
  const connectionsData = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/my-connection`, {
        withCredentials: true
      });
      // console.log("API Response:", res.data);
      
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  const connections = connectionsData || [];

  if (!connections) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">No Friends Yet</h1>
          <p className="opacity-70">Start connecting with people!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            My Friends
          </h1>
          <p className="opacity-70">{connections.length} connections</p>
        </div>

        {/* Friends List */}
        <div className="space-y-4 ">
          {connections.map((connection) => (
            <div 
              key={connection._id} 
              className="bg-base-100 rounded-xl p-6 hover:bg-base-200 transition-all duration-200 border-2 border-base-300"
            >
              <div className="flex items-center justify-between  ">
                {/* Left side - Profile info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={connection.photo}
                      alt={`${connection.firstName} ${connection.lastName}`}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-base-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-base-100 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        {connection.firstName} {connection.lastName}
                      </h3>
                      <span className="text-sm opacity-70">• {connection.age}</span>
                    </div>
                    
                    {connection.bio && (
                      <p className="opacity-70 text-sm mt-1 max-w-md truncate">
                        {connection.bio}
                      </p>
                    )}
                    
                    {connection.skills && connection.skills.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        {connection.skills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index} 
                            className="badge badge-primary badge-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {connection.skills.length > 3 && (
                          <span className="text-xs opacity-70 font-medium">
                            +{connection.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-2">
                  <Link to={`/toChat/${connection._id}`} className="btn btn-primary btn-sm">
                    <button><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-3.147 1.049a.75.75 0 01-.94-.94l1.049-3.147A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg></button>
                  </Link>

                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyConnections;
