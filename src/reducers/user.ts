import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel } from 'utility/types';
import { UserAction } from 'actions';
import { userInfo } from 'os';
import { defaultProfileImageUrl } from 'utility/apiTypes';

interface UserState {
  userInfo: APIGetUserInfoData;
  loggedIn: boolean;
  subscribes: Channel[];
};

const defaultUserInfo : APIGetUserInfoData = {	
  user_id: null,	
  email: null,	
  password: null,	
  nickname: null,	
  gender: 'female',	
  weight: 60,	
  height: 170,	
  level: null,	
  points: null,	
  status: null,	
  created_at: null,	
  updated_at: null,	
  profile_image: defaultProfileImageUrl,	
};

const initialState : UserState = {
  userInfo: defaultUserInfo,
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
        userInfo: defaultUserInfo,
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
