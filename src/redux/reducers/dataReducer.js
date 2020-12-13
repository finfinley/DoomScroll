import {
  SET_DOOMS,
  ENCOURAGE_DOOM,
  DISCOURAGE_DOOM,
  LOADING_DATA,
  DELETE_DOOM,
  POST_DOOM,
  SET_DOOM,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  impendingdooms: [],
  doom: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_DOOMS:
      return {
        ...state,
        impendingdooms: action.payload,
        loading: false,
      };
    case SET_DOOM:
      return {
        ...state,
        doom: action.payload,
      };
    case ENCOURAGE_DOOM:
    case DISCOURAGE_DOOM:
      let index = state.impendingdooms.findIndex(
        (doom) => doom.doomId === action.payload.doomId
      );
      state.impendingdooms[index] = action.payload;
      if (state.doom.doomId === action.payload.doomId) {
        state.doom = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_DOOM:
      index = state.impendingdooms.findIndex(
        (doom) => doom.doomId === action.payload
      );
      state.impendingdooms.splice(index, 1);
      return {
        ...state,
      };
    case POST_DOOM:
      return {
        ...state,
        impendingdooms: [action.payload, ...state.impendingdooms],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        doom: {
          ...state.doom,
          comments: [action.payload, ...state.doom.comments],
        },
      };
    default:
      return state;
  }
}
