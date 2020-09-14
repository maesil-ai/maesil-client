import * as types from 'actions/ActionTypes';
import { SystemAction } from 'actions';
import { TagData } from 'utility/types';

interface SystemState {
    error: boolean;
    message: string;
    tags: TagData[];
};

const initialState : SystemState = {
    error: false,
    message: "",
    tags: null,
};

export default function system(state = initialState, action : SystemAction) {
  switch (action.type) {
    case types.RAISE_ERROR:
      return {
        ...state,
        error: true,
        message: action.message,
      };
    case types.CLOSE_ERROR:
      return {
        ...state,
        error: false,
        message: "",
      };
    case types.SET_TAGS:
      return {
        ...state,
        tags: action.tags,
      };
    default:
      return state;
  }
}
