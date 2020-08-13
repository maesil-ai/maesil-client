import { combineReducers } from 'redux';
import user from 'reducers/user';
import system from 'reducers/system';

const rootReducer = combineReducers({
  user, system,
});

export default rootReducer;

export type RootReducerState = ReturnType<typeof rootReducer>;