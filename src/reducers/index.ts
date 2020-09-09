import { combineReducers } from 'redux';
import user from 'reducers/user';
import system from 'reducers/system';
import content from 'reducers/content';

const rootReducer = combineReducers({
  user, system, content,
});

export default rootReducer;

export type RootReducerState = ReturnType<typeof rootReducer>;