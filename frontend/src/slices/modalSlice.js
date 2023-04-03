/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';

import { actions as loadingStatusActions } from './loadingStatusSlice.js';

const initialState = ({
  isOpened: false,
  type: null,
  context: null,
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, { payload: { type, context = null } }) => {
      state.isOpened = true;
      state.type = type;
      state.context = context;
    },
    close: (state) => {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadingStatusActions.unload, () => initialState);
  },
});

const { actions } = modalSlice;
const selectors = {
  getModalType: (state) => state.modal.type,
  isModalOpened: (state) => state.modal.isOpened,
  getModalContext: (state) => state.modal.context,
};

export { actions, selectors };
export default modalSlice.reducer;
