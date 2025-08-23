import { createSlice } from "@reduxjs/toolkit";

const initialState = []; // must be an array for .filter()

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    // Replace entire feed (accepts array or wrapped payloads)
    setFeed(state, action) {
      const payload = action.payload;
      // backend might return { data: [...] } or [...]
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      return list;
    },

    // Add a single user object
    addUserToFeed(state, action) {
      const u = action.payload;
      return Array.isArray(state) ? [...state, u] : [u];
    },

    // Remove by id (works if state is array or wrapped object shape)
    removeUserFromFeed(state, action) {
      // Accept either: id string, user object, or request object
      const payload = action.payload;
      const id =
        typeof payload === "string"
          ? payload
          : payload?._id ?? payload?.id ?? payload?.toUserId ?? payload?.fromUserId;

      if (!id) return state;

      const filterFn = (u) =>
        u &&
        !(
          u._id === id ||
          u.id === id ||
          u.toUserId === id ||
          u.fromUserId === id
        );

      // If state is plain array
      if (Array.isArray(state)) {
        return state.filter(filterFn);
      }

      // If someone accidentally stored { feed: [...] }:
      if (state && Array.isArray(state.feed)) {
        return { ...state, feed: state.feed.filter(filterFn) };
      }

      // fallback: return unchanged
      return state;
    },

    clearFeed() {
      return [];
    },
  },
});

export const { setFeed, addUserToFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;