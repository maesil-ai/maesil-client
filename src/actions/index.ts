import * as types from './ActionTypes';

export function auth(token) {
  return {
    type: types.AUTH,
    token,
  };
}
