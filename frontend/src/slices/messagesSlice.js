/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.fetchData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      })
      .addCase(channelsActions.deleteChannel, (state, { payload }) => {
        state.messages = state.messages
          .filter((message) => message.channelId !== payload.id);
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
