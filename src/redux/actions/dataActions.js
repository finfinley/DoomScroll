import {
  SET_DOOMS,
  SET_DOOM,
  LOADING_DATA,
  ENCOURAGE_DOOM,
  DISCOURAGE_DOOM,
  DELETE_DOOM,
  SET_ERRORS,
  POST_DOOM,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "axios";

// Get all doom
export const getDooms = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/impendingdooms")
    .then((res) => {
      dispatch({
        type: SET_DOOMS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_DOOMS,
        payload: [],
      });
    });
};
// Post Doom
export const postDoom = (newDoom) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/newdoom", newDoom)
    .then((res) => {
      dispatch({
        type: POST_DOOM,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Get one doom post
export const getDoom = (doomId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/impendingdooms/${doomId}`)
    .then((res) => {
      dispatch({
        type: SET_DOOM,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// Encourage doom
export const encourageDoom = (doomId) => (dispatch) => {
  axios
    .get(`/impendingdooms/${doomId}/encourage`)
    .then((res) => {
      dispatch({
        type: ENCOURAGE_DOOM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
// Discourage doom
export const discourageDoom = (doomId) => (dispatch) => {
  axios
    .get(`/impendingdooms/${doomId}/discourage`)
    .then((res) => {
      dispatch({
        type: DISCOURAGE_DOOM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const deleteDoom = (doomId) => (dispatch) => {
  axios
    .delete(`/impendingdooms/${doomId}`)
    .then(() => {
      dispatch({ type: DELETE_DOOM, payload: doomId });
    })
    .catch((err) => console.log(err));
};

// Submit a comment
export const submitComment = (doomId, commentData) => (dispatch) => {
  axios
    .post(`/impendingdooms/${doomId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      console.log("Error: ", err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_DOOMS,
        payload: res.data.impendingDooms,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_DOOMS,
        payload: null,
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
