/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state"] }] */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import fetchInitialData from './thunks.js';
import { actions as channelsActions } from './channelsSlice.js';
import { actions as loadingStatusActions } from './loadingStatusSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        const restMessages = Object.values(state.entities).filter((e) => e.channelId !== payload);
        messagesAdapter.setAll(state, restMessages);
      })
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      })
      .addCase(loadingStatusActions.unload, () => initialState);
  },
});

const { actions } = messagesSlice;

const selectors = messagesAdapter.getSelectors((state) => state.messages);
const customSelectors = {
  selectAllMesagges: selectors.selectAll,
  selectCurrentChannelMessages: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectAll(state)
      .filter(({ channelId }) => channelId === currentChannelId);
  },
};

export { actions, customSelectors as selectors };
export default messagesSlice.reducer;
