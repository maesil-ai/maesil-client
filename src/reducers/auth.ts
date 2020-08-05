import * as types from '../actions/ActionTypes';

const initialState = {
  token: null,
};

export default function counter(state = initialState, action) {
  switch (action.type) {
    case types.AUTH:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}
