/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state"] }] */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import routes from '../routes/routes.js';

const fetchData = createAsyncThunk(
  'channels/setInitialState',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get(routes.dataPath(), { headers: authHeader });
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.message, status: error.status });
    }
  },
);

const initialState = { loading: true, channels: [], currentChannelId: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    newChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels
        .filter((channel) => channel.id !== payload.id);
      if (state.currentChannelId === payload.id) {
        state.currentChannelId = 1;
      }
    },
    renameChannel: (state, { payload }) => {
      const { id, name } = payload;
      const renamedChannel = state.channels
        .find((channel) => channel.id === id);
      renamedChannel.name = name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      })
      .addCase(fetchData.rejected, (state) => {
        state.loading = false;
      });
  },
});

const actions = {
  ...channelsSlice.actions,
  fetchData,
};

export { actions };
export default channelsSlice.reducer;
