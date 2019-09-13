import {
  SET_FAVOURITES,
  SET_CURRENT_TRACK_INFO,
  HANDLE_FORM_CHANGE,
  UPDATE_FAVOURITES_ARRAY,
  HANDLE_ADD_TO_FAVOURITES
} from "../actions/types";

const initialState = {
  formField: "",
  currentTrack: {},
  favouritesArray: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVOURITES:
      return Object.assign({}, state, { favouritesArray: action.payload });

    case SET_CURRENT_TRACK_INFO:
      return Object.assign({}, state, {
        currentTrack: {
          trackCode: action.payload.barcode,
          lastCheckTimestamp: Date.now(),
          lastEventDate: action.payload.eventdate,
          lastEventDescription: action.payload.eventdescription,
          descrText: ""
        }
      });

    case HANDLE_FORM_CHANGE:
      return Object.assign({}, state, { formField: action.payload });

    case UPDATE_FAVOURITES_ARRAY:
      return Object.assign({}, state, { favouritesArray: action.payload });

    case HANDLE_ADD_TO_FAVOURITES:
      const currentTrack = { ...action.payload.currentTrack };
      currentTrack.addedToFavTimestamp = Date.now();

      const tempArray =
        action.payload.favouritesArray.length > 0
          ? action.payload.favouritesArray.slice()
          : [];

      tempArray.unshift(currentTrack);

      return Object.assign({}, state, {
        favouritesArray: [...tempArray],
        currentTrack: currentTrack
      });

    default:
      return state;
  }
};
