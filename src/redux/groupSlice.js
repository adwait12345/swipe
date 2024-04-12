import { createSlice } from "@reduxjs/toolkit";

const groupsSlice = createSlice({
  name: "groups",
  initialState: [],
  reducers: {
    addGroups: (state, action) => {
      state.find((group) => group.name === action.payload.name)
        ? alert("Group already exists")
        :
      state.push(action.payload);
    },
    deleteGroup: (state, action) => {
      return state.filter((group) => group.id !== action.payload);
    },
    updateGroup: (state, action) => {
      const index = state.findIndex(
        (group) => group.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedGroup;
      }
    },
  },
});

export const {
 addGroups,
  deleteGroup,
  updateGroup,
} = groupsSlice.actions;

export const selectGroup = (state) => state.groups;

export default groupsSlice.reducer;
