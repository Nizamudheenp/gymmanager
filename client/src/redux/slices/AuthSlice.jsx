import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    token: localStorage.getItem("token") || null, 
    role: localStorage.getItem("role") || null, 
    loading: false, 
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
          loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
          },
          loginFailure: (state, action) => {
            state.token = null;
            state.role = null;
            state.error = action.payload;
          },
          logout: (state) => {
            state.token = null;
            state.role = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
          }, 
    }
})

export const {loginSuccess, loginFailure, logout} = authSlice.actions

export const loginUser = (formData) => async (dispatch) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure(error.response.data));
    }
  };

export const logoutUser = ()=> (dispatch)=> {
  dispatch(logout())
  window.location.href = "/"
}

export default authSlice.reducer
