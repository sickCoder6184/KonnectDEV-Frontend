import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import Card from "../common/Card";
import { Filter, X, Search, Users, Settings } from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  
  // Filter UI State
  const [showFilters, setShowFilters] = useState(false);
  const [filterForm, setFilterForm] = useState({
    skills: '',
    minAge: '',
    maxAge: '',
    gender: 'all',
    limit: 10
  });
  const [skillTags, setSkillTags] = useState([]);
  const [tempSkillInput, setTempSkillInput] = useState('');

  const getFeed = async (page = 1, limit = 10, queryFilters = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...queryFilters
      });

      const res = await axios.get(`${BASE_URL}/user/feed?${params}`, {
        withCredentials: true,
      });

      console.log("Feed Response:", res.data);

      // Update Redux with feed data
      dispatch(addFeed(res.data.data));
      
      // Store pagination and filter info
      setPagination(res.data.pagination);
      setFilters(res.data.filters);

    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle skill tag management
  const addSkillTag = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skillTags.includes(trimmedSkill)) {
      const newTags = [...skillTags, trimmedSkill];
      setSkillTags(newTags);
      setFilterForm(prev => ({ ...prev, skills: newTags.join(',') }));
      setTempSkillInput('');
    }
  };

  const removeSkillTag = (skillToRemove) => {
    const newTags = skillTags.filter(skill => skill !== skillToRemove);
    setSkillTags(newTags);
    setFilterForm(prev => ({ ...prev, skills: newTags.join(',') }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter' && tempSkillInput.trim()) {
      e.preventDefault();
      addSkillTag(tempSkillInput);
    }
  };

  // Apply filters
  const applyFilters = () => {
    const queryFilters = {};
    
    if (filterForm.skills) queryFilters.skills = filterForm.skills;
    if (filterForm.minAge) queryFilters.minAge = filterForm.minAge;
    if (filterForm.maxAge) queryFilters.maxAge = filterForm.maxAge;
    if (filterForm.gender !== 'all') queryFilters.gender = filterForm.gender;

    getFeed(1, filterForm.limit, queryFilters);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterForm({
      skills: '',
      minAge: '',
      maxAge: '',
      gender: 'all',
      limit: 10
    });
    setSkillTags([]);
    getFeed(1, 10, {});
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center my-20">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // No feed data
  if (!feed) return null;

  // Empty feed
  if (feed.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center my-20">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-gray-400 text-xl font-medium">No users found!</h1>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your filters or check back later
        </p>
        <button 
          className="btn btn-primary btn-sm mt-4"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Filter Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Discover People</h1>
          {pagination && (
            <p className="text-gray-400">
              Showing {feed.length} of {pagination.total} users
              {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${pagination.totalPages}`}
            </p>
          )}
        </div>
        
        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <div className="badge badge-ghost">
            <Users className="w-4 h-4 mr-1" />
            {pagination?.total || 0} total
          </div>
          <button 
            className={`btn btn-outline btn-sm gap-2 ${showFilters ? 'btn-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters?.skills || filters?.minAge || filters?.maxAge || filters?.gender) && (
              <div className="badge badge-primary badge-xs"></div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card bg-base-200 shadow-lg mb-8">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title text-lg">
                <Settings className="w-5 h-5" />
                Filter Options
              </h3>
              <button 
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skills Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Skills</span>
                </label>
                <div className="space-y-2">
                  <div className="join w-full">
                    <input
                      type="text"
                      placeholder="Add skills (e.g., React, Python)"
                      className="input input-bordered join-item flex-1"
                      value={tempSkillInput}
                      onChange={(e) => setTempSkillInput(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                    />
                    <button 
                      className="btn btn-primary join-item"
                      onClick={() => addSkillTag(tempSkillInput)}
                      disabled={!tempSkillInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Skill Tags */}
                  {skillTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skillTags.map((skill, index) => (
                        <div key={index} className="badge badge-primary gap-2">
                          {skill}
                          <button 
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={() => removeSkillTag(skill)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Age Range */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Age Range</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Min (18)"
                      className="input input-bordered w-full"
                      min="18"
                      max="100"
                      value={filterForm.minAge}
                      onChange={(e) => setFilterForm(prev => ({ ...prev, minAge: e.target.value }))}
                    />
                    <label className="label">
                      <span className="label-text-alt">Min Age</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max (100)"
                      className="input input-bordered w-full"
                      min="18"
                      max="100"
                      value={filterForm.maxAge}
                      onChange={(e) => setFilterForm(prev => ({ ...prev, maxAge: e.target.value }))}
                    />
                    <label className="label">
                      <span className="label-text-alt">Max Age</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Gender & Results Per Page */}
              <div className="space-y-4">
                {/* Gender Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Gender</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={filterForm.gender}
                    onChange={(e) => setFilterForm(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Results Per Page */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Results Per Page</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={filterForm.limit}
                    onChange={(e) => setFilterForm(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-base-300">
              <button 
                className="btn btn-primary flex-1 gap-2"
                onClick={applyFilters}
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                Apply Filters
              </button>
              <button 
                className="btn btn-ghost flex-1"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {feed.map((user) => (
          <Card key={user._id} user={user} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => pagination.hasPrev && getFeed(pagination.page - 1, filterForm.limit, {
                skills: filterForm.skills,
                minAge: filterForm.minAge,
                maxAge: filterForm.maxAge,
                gender: filterForm.gender !== 'all' ? filterForm.gender : undefined
              })}
              disabled={!pagination.hasPrev || loading}
            >
              «
            </button>
            
            <button className="join-item btn btn-sm btn-disabled">
              Page {pagination.page}
            </button>
            
            <button
              className="join-item btn btn-sm"
              onClick={() => pagination.hasNext && getFeed(pagination.page + 1, filterForm.limit, {
                skills: filterForm.skills,
                minAge: filterForm.minAge,
                maxAge: filterForm.maxAge,
                gender: filterForm.gender !== 'all' ? filterForm.gender : undefined
              })}
              disabled={!pagination.hasNext || loading}
            >
              »
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            {pagination.page} of {pagination.totalPages} pages
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
