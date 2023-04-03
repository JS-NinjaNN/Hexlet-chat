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

// const fetchData = createAsyncThunk(
//   'channelsInfo/setInitialState',
//   async (authHeader, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(routes.dataPath(), { headers: authHeader });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({ message: error.message, status: error.status });
//     }
//   },
// );
