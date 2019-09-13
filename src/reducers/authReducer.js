import {
  FETCH_USER,
  UPDATE_FAVOURITES_SAVED_TIMESTAMP
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;
    case UPDATE_FAVOURITES_SAVED_TIMESTAMP:
      return Object.assign({}, state, {
        userProfile: {
          ...state.userProfile,
          favouritesSaveTimestamp: action.payload
        }
      });
    default:
      return state;
  }
};
