// AuthForm.jsx
import React, { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import ProfileCard from "../common/ProfileCard";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "male",
    photo: "",
    bio: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Create preview user object for ProfileCard
  const previewUser = useMemo(() => ({
  firstName: form.firstName || "First Name",
  lastName: form.lastName || "Last Name", 
  age: form.age || null,
  gender: form.gender || "male",
  photo: form.photo || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80",
  bio: form.bio || "Tell us about yourself...",
  skills: form.skills 
    ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
    : ["Add your skills"]
}), [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const url = isLogin ? "/login" : "/signUp";
      const payload = isLogin
        ? {
            loggedEmail: form.emailId,
            password: form.password,
          }
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            emailId: form.emailId,
            password: form.password,
            age: form.age,
            gender: form.gender,
            photo: form.photo || undefined,
            bio: form.bio || undefined,
            skills: form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          };

      const res = await axios.post(`${BASE_URL}${url}`, payload, {
        withCredentials: true,
      });

      const userData = isLogin ? res.data?.data : res.data?.user;
      if (userData) {
        dispatch(addUser(userData));
      }
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((v) => !v);
    setError("");
    // Reset form when switching modes
    setForm({
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
  age: "",
  gender: "male",
  photo: "", 
  bio: "",
  skills: "",
});

  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Side panel - Image for Login, ProfileCard for SignUp */}
        <div className="hidden md:block">
          <div className="card bg-base-100 shadow-xl overflow-hidden h-full">
            {isLogin ? (
              // Login Image
              <figure className="h-full">
                <img
                  src="/LoginImg.jpg"
                  alt="Login visual"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop";
                  }}
                />
              </figure>
            ) : (
              // Live ProfileCard Preview for SignUp
              <div className="p-6 h-full flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-base-content/80">
                      Live Preview
                    </h3>
                    <p className="text-sm text-base-content/60">
                      See how your profile will look
                    </p>
                  </div>
                  <ProfileCard user={previewUser} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form panel */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={toggleMode}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </div>
              <p className="text-sm text-base-content/60 mb-4">
                {isLogin
                  ? "Access your account using your email and password."
                  : "Fill in your details to get started with live preview."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="input input-bordered w-full"
                        required
                      />
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        name="age"
                        type="number"
                        min="18"
                        max="100"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="Age"
                        className="input input-bordered w-full"
                        required
                      />
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                      </select>
                      <input
                        name="photo"
                        value={form.photo}
                        onChange={handleChange}
                        placeholder="Photo URL (optional)"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="Short bio (optional) 200 words"
                      className="textarea textarea-bordered w-full"
                      rows={3}
                    />

                    <div className="form-control">
                      <input
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="Skills (comma-separated)"
                        className="input input-bordered w-full"
                      />
                      <label className="label">
                        <span className="label-text-alt">
                          Example: Python, React, Docker
                        </span>
                      </label>
                    </div>
                  </>
                )}

                <input
                  name="emailId"
                  type="email"
                  value={form.emailId}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input input-bordered w-full"
                  required
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="input input-bordered w-full"
                  required
                />

                {error && (
                  <p className="text-rose-500 text-sm mt-1">{error}</p>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary w-full mt-2 ${
                    submitting ? "btn-disabled" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting
                    ? "Please wait..."
                    : isLogin
                    ? "Login"
                    : "Sign Up"}
                </button>

                <div className="text-center text-sm mt-2">
                  <span className="opacity-70">
                    {isLogin
                      ? "Need an account?"
                      : "Already have an account?"}
                  </span>{" "}
                  <button
                    type="button"
                    className="link link-primary"
                    onClick={toggleMode}
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </div>
              </form>

              {/* Small tip footer */}
              {!isLogin && (
                <div className="mt-4 text-xs text-base-content/60">
                  By signing up, you agree to our terms and privacy policy.
                </div>
              )}
            </div>
          </div>

          {/* Mobile ProfileCard Preview (only shows on small screens during signup) */}
          {!isLogin && (
            <div className="mt-6 md:hidden">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h4 className="text-center font-medium mb-3">Profile Preview</h4>
                  <ProfileCard user={previewUser} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
