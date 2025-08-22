import React, { useState, useRef, useMemo } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice'; // Adjust path as needed
import ProfileCard from "./ProfileCard";

const normalizeGenderForApi = (g) => {
  if (!g) return "male";
  const s = String(g).trim().toLowerCase();
  if (["male", "m"].includes(s)) return "male";
  if (["female", "f"].includes(s)) return "female"; 
  if (["other", "others", "o"].includes(s)) return "others";
  return "male";
};

const EditProfile = ({ user = {} }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    bio: user.bio || "",
    skills: user.skills?.length ? user.skills : [""],
    photo: user.photo || "https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg?semt=ais_hybrid&w=740&q=80",
  });

  const [submitting, setSubmitting] = useState(false);
  // ✅ NEW: State for handling success/error messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // All your existing refs...
  const photoRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const bioRef = useRef(null);
  const addSkillBtnRef = useRef(null);
  const saveBtnRef = useRef(null);

  const skillRefs = useRef([]);
  if (skillRefs.current.length !== formData.skills.length) {
    skillRefs.current = Array(formData.skills.length)
      .fill(null)
      .map((_, i) => skillRefs.current[i] || React.createRef());
  }

  const focusRef = (ref) => {
    if (ref?.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  };

  const fieldOrder = useMemo(() => [
    photoRef, firstNameRef, lastNameRef, ageRef, genderRef, bioRef, addSkillBtnRef, saveBtnRef,
  ], []);

  // ✅ NEW: Clear messages when user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts editing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
    
    // Clear messages when user starts editing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const addSkill = (atIndex) => {
    setFormData((prev) => {
      const skills = [...prev.skills];
      if (typeof atIndex === "number") {
        skills.splice(atIndex, 0, "");
      } else {
        skills.push("");
      }
      return { ...prev, skills };
    });
  };

  const removeSkill = (index) => {
    setFormData((prev) => {
      const skills = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills: skills.length ? skills : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Clear any previous messages
    setMessage("");
    setMessageType("");

    const payload = {
      firstName: String(formData.firstName || "").trim(),
      lastName: String(formData.lastName || "").trim(), 
      age: formData.age ? Number(formData.age) : 18,
      gender: normalizeGenderForApi(formData.gender),
      bio: String(formData.bio || "").trim(),
      skills: (formData.skills || [])
        .map(s => String(s).trim())
        .filter(Boolean),
      photo: String(formData.photo || "").trim(),
    };

    setSubmitting(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        payload,
        { withCredentials: true }
      );
      
      // ✅ SUCCESS: Show success message from backend
      if (res?.data?.message) {
        setMessage(res.data.message);
        setMessageType("success");
      }
      
      // Update Redux store
      if (res?.data?.data) {
        dispatch(addUser(res.data.data));
        
        setFormData(prev => ({
          ...prev,
          ...res.data.data,
          skills: Array.isArray(res.data.data.skills) && res.data.data.skills.length 
            ? res.data.data.skills 
            : [""]
        }));
      }
      
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      
      // ✅ ERROR: Extract and show backend error message
      let errorMessage = "Failed to update profile";
      
      if (error?.response?.data?.message) {
        // Backend sent a specific error message
        errorMessage = error.response.data.message;
      } else if (error?.response?.data && typeof error.response.data === 'string') {
        // Backend sent error as string
        errorMessage = error.response.data;
      } else if (error?.message) {
        // Network or other error
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // All your existing keyboard navigation code...
  const onEnterNext = (e, currentRef) => {
    if (e.key !== "Enter") return;
    if (e.shiftKey && e.target.tagName === "TEXTAREA") return;
    e.preventDefault();
    const idx = fieldOrder.findIndex((r) => r === currentRef);
    if (idx > -1 && idx < fieldOrder.length - 1) {
      focusRef(fieldOrder[idx + 1]);
    } else {
      handleSubmit(e);
    }
  };

  const onSkillKeyDown = (e, index) => {
    const value = formData.skills[index]?.trim() || "";

    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        addSkill(index);
        setTimeout(() => focusRef(skillRefs.current[index]), 0);
        return;
      }
      if (value.length > 0) {
        addSkill(index + 1);
        setTimeout(() => focusRef(skillRefs.current[index + 1]), 0);
      } else {
        if (index === formData.skills.length - 1) {
          focusRef(saveBtnRef);
        } else {
          focusRef(skillRefs.current[index + 1]);
        }
      }
    }

    if (e.key === "Backspace" && !value) {
      e.preventDefault();
      if (formData.skills.length > 1) {
        removeSkill(index);
        setTimeout(() => {
          const prevIndex = Math.max(0, index - 1);
          focusRef(skillRefs.current[prevIndex]);
        }, 0);
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(formData.skills.length - 1, index + 1);
      focusRef(skillRefs.current[next]);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      focusRef(skillRefs.current[prev]);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-7xl mx-auto">
        <form className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start" onSubmit={handleSubmit}>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold mb-6 text-center">Edit Profile</h2>

              {/* ✅ NEW: Dynamic Success/Error Message Display */}
              {message && (
                <div className={`alert ${messageType === "success" ? "alert-success" : "alert-error"} mb-4`}>
                  <div className="flex items-center gap-2">
                    {messageType === "success" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                    <span>{message}</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* All your existing form fields... */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Photo URL</span>
                  </label>
                  <input
                    ref={photoRef}
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    onKeyDown={(e) => onEnterNext(e, photoRef)}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Enter photo URL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">First Name *</span>
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onKeyDown={(e) => onEnterNext(e, firstNameRef)}
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Last Name *</span>
                    </label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onKeyDown={(e) => onEnterNext(e, lastNameRef)}
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Age *</span>
                    </label>
                    <input
                      ref={ageRef}
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      onKeyDown={(e) => onEnterNext(e, ageRef)}
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="Enter age"
                      min="18"
                      max="60"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Gender *</span>
                    </label>
                    <select
                      ref={genderRef}
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onKeyDown={(e) => onEnterNext(e, genderRef)}
                      className="select select-bordered w-full focus:select-primary"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Bio</span>
                    <span className="label-text-alt mr-4">{formData.bio.length}/200</span>
                  </label>
                  <textarea
                    ref={bioRef}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    onKeyDown={(e) => onEnterNext(e, bioRef)}
                    className="textarea textarea-bordered h-24 resize-none focus:textarea-primary"
                    placeholder="Tell us about yourself..."
                    maxLength="200"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Skills</span>
                    <span className="label-text-alt">
                      {formData.skills.filter((s) => s.trim()).length} skills
                    </span>
                  </label>

                  <div className="space-y-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          ref={skillRefs.current[index]}
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          onKeyDown={(e) => onSkillKeyDown(e, index)}
                          className="input input-bordered flex-1 focus:input-primary"
                          placeholder={`Skill ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            removeSkill(index);
                            setTimeout(() => {
                              const prevIndex = Math.max(0, index - 1);
                              focusRef(skillRefs.current[prevIndex]);
                            }, 0);
                          }}
                          className="btn btn-outline btn-error btn-square"
                          title="Remove skill"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      ref={addSkillBtnRef}
                      type="button"
                      onClick={() => {
                        addSkill();
                        setTimeout(() => focusRef(skillRefs.current[formData.skills.length]), 0);
                      }}
                      className="btn btn-outline btn-primary w-full"
                    >
                      <span className="text-lg">+</span>
                      Add Skill
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline flex-1 order-2 sm:order-1"
                    disabled={submitting}
                    onClick={() => window.history.back?.()}
                  >
                    Cancel
                  </button>
                  <button
                    ref={saveBtnRef}
                    type="submit"
                    className={`btn btn-primary flex-1 order-1 sm:order-2 ${submitting ? "loading" : ""}`}
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="xl:sticky xl:top-4">
            <div className="card bg-base-200 shadow-xl mb-4">
              <div className="card-body pb-2">
                <h3 className="card-title text-xl font-bold text-center mb-4">Live Preview</h3>
              </div>
            </div>
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
              <ProfileCard user={formData} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
