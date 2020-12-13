import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  ENCOURAGE_DOOM,
  DISCOURAGE_DOOM,
  MARK_DOOMTICKS_READ,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  encouragements: [],
  doomticks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case ENCOURAGE_DOOM:
      return {
        ...state,
        encouragements: [
          ...state.encouragements,
          {
            userHandle: state.credentials.handle,
            doomId: action.payload.doomId,
          },
        ],
      };
    case DISCOURAGE_DOOM:
      return {
        ...state,
        encouragements: state.encouragements.filter(
          (encouragement) => encouragement.doomId !== action.payload.doomId
        ),
      };
    case MARK_DOOMTICKS_READ:
      state.doomticks.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
