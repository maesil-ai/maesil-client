import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData } from 'utility/types';
import { UserAction } from 'actions';

interface UserState {
  userInfo: APIGetUserInfoData | null;
  loggedIn: boolean;
};

const initialState : UserState = {
  userInfo: null,
  loggedIn: false,
};

export default function user(state = initialState, action : UserAction) {
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
        loggedIn: true,
      };
    case types.CLEAR_USER:
      return {
        ...state,
        userInfo: null,
        loggedIn: false,
      }
    default:
      return state;
  }
}
