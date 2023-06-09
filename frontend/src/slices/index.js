import { configureStore } from '@reduxjs/toolkit';

import loadingStatusReducer from './loadingStatusSlice.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
    loadingStatus: loadingStatusReducer,
  },
});
