import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async (fetchServerData, { rejectWithValue }) => {
    try {
      const { data } = await fetchServerData();
      return data;
    } catch (error) {
      if (error.isAxiosError) {
        return rejectWithValue(error.response.status);
      }
      throw error;
    }
  },
);

export default fetchInitialData;
