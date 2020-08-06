import * as types from './ActionTypes';

export function auth(token: any) {
  return {
    type: types.AUTH,
    token,
  };
}
