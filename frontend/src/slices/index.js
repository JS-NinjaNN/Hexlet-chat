import { combineReducers, configureStore } from '@reduxjs/toolkit';

import channelsSlice, { actions as channelsActions } from './channelsSlice.js';
import messagesSlice, { actions as messagesActions } from './messagesSlice.js';

const actions = {
  ...channelsActions,
  ...messagesActions,
};

export {
  actions,
};

const reducer = combineReducers({
  channelsInfo: channelsSlice,
  messagesInfo: messagesSlice,
});

export default configureStore({
  reducer,
});
