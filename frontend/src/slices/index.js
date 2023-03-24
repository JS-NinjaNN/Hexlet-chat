import { combineReducers } from '@reduxjs/toolkit';

import channelsSlice, { actions as channelsActions } from './channelsSlice.js';
import messagesSlice, { actions as messagesActions } from './messagesSlice.js';

const actions = {
  ...channelsActions,
  ...messagesActions,
};

export {
  actions,
};

export default combineReducers({
  channelsInfo: channelsSlice,
  messagesInfo: messagesSlice,
});
