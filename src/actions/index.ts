import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData } from 'utility/types';

export const setUser = (userInfo: APIGetUserInfoData) => {
  return {
    type: types.SET_USER,
    userInfo: userInfo,
  };
}

export const clearUser = () => {
  return {
    type: types.CLEAR_USER,
  }
}

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>;
