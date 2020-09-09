import * as types from 'actions/ActionTypes';
import { ContentAction } from 'actions';
import { ContentData, PlayRecord } from 'utility/types';

interface ContentState {
    content: ContentData,
    record: PlayRecord,
};

const initialState : ContentState = {
    content: null,
    record: null,
};

export default function content(state = initialState, action : ContentAction) {
  switch (action.type) {
    case types.SET_CONTENT:
        return {
            ...state,
            content: action.content,
        };
    case types.SET_RESULT:
        return {
            ...state,
            record: action.record,
        };
    case types.CLEAR_CONTENT:
        return initialState;
    default:
        return state;
  }
}
