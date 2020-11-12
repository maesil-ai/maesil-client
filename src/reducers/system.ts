import * as types from 'actions/ActionTypes';
import { SystemAction } from 'actions';
import { TagData } from 'utility/types';

interface SystemState {
    error: boolean;
    message: string;
    tutorialStep: number;
    tags: TagData[];
};

const initialState : SystemState = {
    error: false,
    message: "",
    tutorialStep: 0,
    tags: [],
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
    case types.SET_TUTORIAL_STEP:
      return {
        ...state,
        tutorialStep: action.step,
      };
    case types.SET_TAGS_DATA:
      return {
        ...state,
        tags: action.tagsData,
      };
    default:
      return state;
  }
}
