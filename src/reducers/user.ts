import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel } from 'utility/types';
import { UserAction } from 'actions';
import { userInfo } from 'os';

interface UserState {
  userInfo: APIGetUserInfoData;
  loggedIn: boolean;
  subscribes: Channel[];
};

const initialState : UserState = {
  userInfo: null,
  loggedIn: false,
  subscribes: null,
};

export default function user(state = initialState, action : UserAction) {
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
        subscribes: action.subscribes,
        loggedIn: true,
      };
    case types.CLEAR_USER:
      return {
        ...state,
        userInfo: null,
        subscribes: null,
        loggedIn: false,
      }
    case types.SUBSCRIBE:
      return {
        ...state,
        subscribes: 
          action.ok ? state.subscribes.concat([action.channel])
                    : state.subscribes.filter((channel) => channel.id != action.channel.id),
      }
    case types.CHANGE_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          name: action.name,
          gender: action.sex,
          height: action.height,
          weight: action.weight,
        },
      }
    default:
      return state;
  }
}
