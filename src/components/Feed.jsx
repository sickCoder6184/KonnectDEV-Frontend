import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useRef, useState } from "react";
import Card from "../common/Card";
import { Filter, X, Search, Users, Settings, ChevronLeft, ChevronRight, RefreshCcwDot,  } from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  
  // local feed used for rendering (avoids relying on slice behaviour)
  const [localFeed, setLocalFeed] = useState([]);
  // remember last query filters used for pagination
  const currentQueryRef = useRef({});
  // abort controller ref to cancel inflight requests
  const abortCtrlRef = useRef(null);

  // Data state
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [filterForm, setFilterForm] = useState({
    skills: "",
    minAge: "",
    maxAge: "",
    gender: "all",
    limit: 10,
  });
  const [skillTags, setSkillTags] = useState([]);
  const [tempSkillInput, setTempSkillInput] = useState("");

  // Carousel control
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const getFeed = async (page = 1, limit = 10, queryFilters = {}) => {
    // cancel previous request
    if (abortCtrlRef.current) {
      try { abortCtrlRef.current.abort(); } catch (e) {}
    }
    const controller = new AbortController();
    abortCtrlRef.current = controller;
    try {
      setLoading(true);
      // remember the query used so pagination can reuse it
      currentQueryRef.current = queryFilters || {};

      // Build URLSearchParams but skip null/undefined/empty values
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      Object.entries(queryFilters || {}).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (typeof v === "string" && v.trim() === "") return;
        if (Array.isArray(v)) {
          if (v.length === 0) return;
          params.append(k, v.join(","));
        } else {
          params.append(k, String(v));
        }
      });

      const res = await axios.get(`${BASE_URL}/user/feed?${params.toString()}`, {
        withCredentials: true,
        signal: controller.signal,
      });

      const data = res.data?.data || [];
      setLocalFeed(data);
      dispatch(addFeed(data));
      setPagination(res.data?.pagination || null);
      setFilters(res.data?.filters || null);
      setActiveIndex(0); // reset to first card on reload
    } catch (err) {
      // ignore aborts
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        return;
      }
      console.error("Error fetching feed:", err);
      setLocalFeed([]);
    } finally {
      setLoading(false);
      abortCtrlRef.current = null;
    }
  };

  // Skill tags
  const addSkillTag = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skillTags.includes(trimmed)) {
      const newTags = [...skillTags, trimmed];
      setSkillTags(newTags);
      setFilterForm((prev) => ({ ...prev, skills: newTags.join(",") }));
      setTempSkillInput("");
    }
  };
  const removeSkillTag = (skill) => {
    const newTags = skillTags.filter((s) => s !== skill);
    setSkillTags(newTags);
    setFilterForm((prev) => ({ ...prev, skills: newTags.join(",") }));
  };
  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && tempSkillInput.trim()) {
      e.preventDefault();
      addSkillTag(tempSkillInput);
    }
  };

  const applyFilters = () => {
    const queryFilters = {};
    if (filterForm.skills) queryFilters.skills = filterForm.skills;
    if (filterForm.minAge) queryFilters.minAge = filterForm.minAge;
    if (filterForm.maxAge) queryFilters.maxAge = filterForm.maxAge;
    if (filterForm.gender !== "all") queryFilters.gender = filterForm.gender;
    // store filters and fetch page 1
    currentQueryRef.current = queryFilters;
    getFeed(1, filterForm.limit, queryFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilterForm({ skills: "", minAge: "", maxAge: "", gender: "all", limit: 10 });
    setSkillTags([]);
    currentQueryRef.current = {};
    getFeed(1, 10, {});
  };

  useEffect(() => {
    currentQueryRef.current = {};
    getFeed(1, filterForm.limit, currentQueryRef.current);
  }, []);

  // Carousel handlers
  const prevSlide = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const nextSlide = () => {
    setActiveIndex((prev) => (prev < (localFeed.length - 1) ? prev + 1 : prev));
  };

  useEffect(() => {
    // Smooth scroll to active item if container is scrollable horizontally
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const itemWidth = container.clientWidth; // each item is full width
    container.scrollTo({ left: activeIndex * itemWidth, behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top header */}
      <div className="navbar bg-base-100 border-b border-base-300">
        <div className="flex-1">
          <span className="btn btn-ghost normal-case text-xl gap-2">
            <button
            className="btn btn-ghost btn-circle"
            onClick={() => getFeed(1, filterForm.limit, {})}
            title="Refresh"
          >
            <Users size={18} />
          </button> Discover Developers
          </span>
        </div>
        <div className="flex-none gap-2">
          
          <button
            className="btn btn-outline btn-sm md:btn-md gap-2"
            onClick={() => setShowFilters(true)}
          >
            <Filter size={16} />
            Filters
          </button>
          
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full flex flex-col items-center justify-center gap-4 py-16">
          <div className="text-sm opacity-70">Fetching profiles…</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="loading loading-ring loading-xs"></span>
<span className="loading loading-ring loading-sm"></span>
<span className="loading loading-ring loading-md"></span>
<span className="loading loading-ring loading-lg"></span>
<span className="loading loading-ring loading-xl"></span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && feed?.length === 0 && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="hero bg-base-100 rounded-xl border border-base-300">
            <div className="hero-content text-center py-16">
              <div className="max-w-md">
                <h1 className="text-2xl font-bold mb-2">No results found</h1>
                <p className="opacity-80 mb-4">Try adjusting your filters or check back later.</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel of Cards */}
      {!loading && localFeed?.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Active filters summary */}
          {filters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              
              {filters.skills && <div className="badge badge-primary">Skills: {filters.skills}</div>}
              {filters.gender && filters.gender !== "all" && (
                <div className="badge badge-secondary">Gender: {filters.gender}</div>
              )}
              {(filters.minAge || filters.maxAge) && (
                <div className="badge badge-accent">
                  Age: {filters.minAge || "—"} - {filters.maxAge || "—"}
                </div>
              )}
            </div>
          )}

          {/* Carousel container */}
          <div className="relative">
            {/* Horizontal carousel (full-width items) */}
            <div
              ref={carouselRef}
              className="carousel rounded-box w-full"
              style={{ scrollSnapType: "x mandatory", overflowX: "auto" }}
            >
              {localFeed.map((user, idx) => (
                <div
                  key={user._id}
                  className="carousel-item w-full justify-center"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="m-6 w-full max-w-xl mx-auto">
                    <Card user={user} />
                  </div>
                </div>
              ))}
            </div>

            {/* Prev/Next controls */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                className="btn btn-circle btn-ghost"
                onClick={prevSlide}
                disabled={activeIndex === 0}
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                className="btn btn-circle btn-ghost"
                onClick={nextSlide}
                disabled={activeIndex >= localFeed.length - 1}
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Position indicator + pagination info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="join">
              {localFeed.map((_, i) => (
                <button
                  key={i}
                  className={`join-item btn btn-xs ${i === activeIndex ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setActiveIndex(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {pagination && (
              <div className="text-sm opacity-70">
                Showing {activeIndex + 1} of {localFeed.length} on this page • Page {pagination.page} of{" "}
                {pagination.totalPages}
              </div>
            )}
          </div>

          {/* Page controls (server pagination) */}
          {pagination && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="btn"
                disabled={pagination.page <= 1 || loading}
                onClick={() => getFeed(pagination.page - 1, pagination.limit, currentQueryRef.current || {})}
              >
                Prev Page
              </button>
              <button
                className="btn btn-primary"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => getFeed(pagination.page + 1, pagination.limit, currentQueryRef.current || {})}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filters Modal */}
      <div className={`modal ${showFilters ? "modal-open" : ""}`}>
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Filter size={18} />
              Filter results
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Skills input with tags */}
          <label className="label">
            <span className="label-text">Skills</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Add skill and press Enter"
              value={tempSkillInput}
              onChange={(e) => setTempSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyPress}
            />
            <button className="btn btn-primary" onClick={() => addSkillTag(tempSkillInput)}>
              Add
            </button>
          </div>
          {skillTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skillTags.map((s) => (
                <div key={s} className="badge badge-outline gap-1">
                  {s}
                  <button className="btn btn-ghost btn-xs ml-1" onClick={() => removeSkillTag(s)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Age/Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div>
              <label className="label">
                <span className="label-text">Min Age</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={filterForm.minAge}
                onChange={(e) => setFilterForm((p) => ({ ...p, minAge: e.target.value }))}
                placeholder="e.g., 18"
                min={0}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Max Age</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={filterForm.maxAge}
                onChange={(e) => setFilterForm((p) => ({ ...p, maxAge: e.target.value }))}
                placeholder="e.g., 45"
                min={0}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterForm.gender}
                onChange={(e) => setFilterForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Limit */}
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Results per page</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-40"
              value={filterForm.limit}
              onChange={(e) => setFilterForm((p) => ({ ...p, limit: Number(e.target.value || 10) }))}
              min={1}
              max={50}
            />
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={clearFilters}>
              Clear
            </button>
            <button className="btn btn-primary" onClick={applyFilters} disabled={loading}>
              Apply
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setShowFilters(false)} />
      </div>
    </div>
  );
};

export default Feed;
