import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  // Extract targetUserId from URL parameters (e.g., /chat/:targetUserId)
  const { targetUserId } = useParams();
  
  // State to store all chat messages in the conversation
  const [messages, setMessages] = useState([]);
  
  // State to store the current message being typed by the user
  const [newMessage, setNewMessage] = useState("");
  
  // Get logged-in user data from Redux store
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;
  
  // Reference to the messages container for auto-scrolling functionality
  const listRef = useRef(null);

  /**
   * BACKEND COMMUNICATION FUNCTION
   * Fetches existing chat messages between logged-in user and target user
   * Makes HTTP GET request to backend API endpoint
   */
  const fetchChatMessages = async () => {
    // API call to get chat history from database
    const chat = await axios.get(BASE_URL + "/toChat/" + targetUserId, {
      withCredentials: true, // Include cookies for authentication
    });

    // Transform backend data structure to frontend-friendly format
    // Backend sends: {senderId: {firstName, lastName}, text}
    // Frontend needs: {firstName, lastName, text}
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  /**
   * EFFECT: Load chat history on component mount
   * Runs once when component first renders to get existing messages
   */
  useEffect(() => {
    fetchChatMessages();
  }, []);

  /**
   * EFFECT: Setup real-time socket connection for live messaging
   * Handles socket connection, room joining, and incoming message listening
   */
  useEffect(() => {
    // Don't establish socket connection until user is authenticated
    if (!loggedInUserId) {
      return;
    }
    
    // Create WebSocket connection to server
    const socket = createSocketConnection();
    
    /**
     * SOCKET EVENT: Join specific chat room
     * Creates a unique room for this conversation between two users
     * Backend uses hashed room ID to ensure privacy and uniqueness
     */
    socket.emit("joinChat", {
      firstName: loggedInUser.firstName,
      loggedInUserId,    // Current user's MongoDB _id
      targetUserId,      // Other participant's MongoDB _id
    });

    /**
     * SOCKET LISTENER: Handle incoming messages in real-time
     * Updates local message state when other user sends a message
     * Backend broadcasts to all users in the same room
     */
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      // Add new message to existing messages array using functional update
      // Prevents stale closure issues with state
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    /**
     * CLEANUP: Disconnect socket when component unmounts
     * Prevents memory leaks and multiple connections
     */
    return () => {
      socket.disconnect();
    };
  }, [loggedInUserId, targetUserId]); // Re-run if user or target changes

  /**
   * EFFECT: Auto-scroll to bottom when new messages arrive
   * Ensures latest messages are always visible to the user
   */
  useEffect(() => {
    if (listRef.current) {
      // Smooth scroll to bottom of messages container
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight, // Scroll to maximum height
        behavior: "smooth", // Animated scroll instead of instant jump
      });
    }
  }, [messages]); // Trigger whenever messages array changes

  /**
   * MESSAGE SENDING FUNCTION
   * Handles sending new messages to the backend and other users
   * Creates new socket connection for message emission
   */
  const sendMessage = () => {
    // Create fresh socket connection for sending
    const socket = createSocketConnection();
    
    /**
     * SOCKET EVENT: Send message to backend
     * Backend will:
     * 1. Validate user permissions
     * 2. Save message to MongoDB database
     * 3. Broadcast to all users in the chat room
     * 4. Update chat document with new message
     */
    socket.emit("sendMessage", {
      firstName: loggedInUser.firstName,  // Sender's first name for display
      lastName: loggedInUser.lastName,    // Sender's last name for display
      loggedInUserId,                     // Sender's MongoDB ObjectId
      targetUserId,                       // Recipient's MongoDB ObjectId
      text: newMessage,                   // Actual message content
    });
    
    // Clear input field after sending
    setNewMessage("");
  };

  // Animation variants for smooth message entrance/exit effects
  const messageVariants = {
    hidden: { opacity: 0, x: -20 },     // Start invisible and offset left
    visible: { opacity: 1, x: 0 },      // Fade in and slide to position
    exit: { opacity: 0, x: 20 },        // Fade out and slide right
  };

  // Container animation for staggered message loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, // Animate children with delay
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto m-15 border border-gray-300 rounded-xl shadow-lg flex flex-col h-[70vh] bg-base-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Chat header with title */}
      <header className="p-5 border-b border-gray-300 bg-primary text-primary-content rounded-t-xl flex items-center justify-between select-none shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">Chat</h1>
        {/* Optional: Avatar or online status indicator */}
      </header>

      {/* Messages display area with scrollable content */}
      <main ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-base-200">
        {/* Empty state message when no conversation exists yet */}
        {messages.length === 0 && (
          <p className="text-center text-base-content/50 italic select-none">
            No messages yet. Start the conversation! 🙂
          </p>
        )}

        {/* Animated message list with entrance/exit animations */}
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            // Determine if current message is from logged-in user (for styling)
            const isSelf = loggedInUser.firstName === msg.firstName;
            return (
              <motion.div
                key={index}
                className={`chat items-start ${
                  isSelf ? "chat-end" : "chat-start" // Align messages left/right based on sender
                }`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Smooth layout changes when messages are added/removed
              >
                {/* Message header with sender name and timestamp */}
                <div
                  className={`chat-header select-text ${
                    isSelf ? "text-secondary" : "text-primary"
                  } font-semibold`}
                >
                  {`${msg.firstName} ${msg.lastName}`}
                  <time
                    className="text-xs opacity-50 ml-3 tabular-nums"
                    dateTime=""
                  >
                    2 hours ago {/* TODO: Use actual message timestamp */}
                  </time>
                </div>
                
                {/* Message bubble with content */}
                <div
                  className={`chat-bubble max-w-[70vw] shadow-md transition-colors duration-300 ${
                    isSelf
                      ? "bg-secondary text-secondary-content"    // User's messages
                      : "bg-base-100 text-base-content"          // Other user's messages
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Message footer with read status */}
                <div className="chat-footer text-xs opacity-50 select-none">
                  {isSelf ? "Seen" : ""} {/* Only show "Seen" for user's own messages */}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      {/* Message input composer at bottom of chat */}
      <footer className="p-5 border-t border-gray-300 bg-base-100 rounded-b-xl flex items-center gap-3 select-none">
        {/* Text input for typing new messages */}
        <input
          aria-label="Type your message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered input-md flex-1 rounded-lg bg-base-200 text-base-content placeholder:text-base-content/50 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 transition transform duration-200 ease-in-out focus:scale-105"
          onKeyDown={(e) => {
            // Send message when Enter is pressed (but not Shift+Enter for line breaks)
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent form submission or newline
              sendMessage();
            }
          }}
        />
        
        {/* Send button with disabled state for empty messages */}
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()} // Disable if message is empty or whitespace only
          className="btn btn-primary btn-md disabled:btn-disabled transition-transform duration-150 active:scale-95"
          title={newMessage.trim() ? "Send message" : "Enter a message to send"}
        >
          Send
        </button>
      </footer>
    </motion.div>
  );
};

export default Chat;