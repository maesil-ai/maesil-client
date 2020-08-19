import * as types from 'actions/ActionTypes';
import { SystemAction } from 'actions';

interface SystemState {
    error: boolean;
    message: string;
};

const initialState : SystemState = {
    error: false,
    message: "",
};

export default function system(state = initialState, action : SystemAction) {
  switch (action.type) {
    case types.RAISE_ERROR:
      return {
        ...state,
        error: true,
        message: action.message,
      }
    case types.CLOSE_ERROR:
      return {
        ...state,
        error: false,
        message: "",
      }
    default:
      return state;
  }
}
