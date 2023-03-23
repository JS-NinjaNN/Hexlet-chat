/* eslint-disable functional/no-expression-statements */
import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.fetchData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
