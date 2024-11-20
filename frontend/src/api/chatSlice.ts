import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ChatState {
  prompt: string;
  response: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  prompt: '',
  response: '',
  loading: false,
  error: null,
};

interface ChatResponse {
  choices: { message: { content: string } }[];
}

export const fetchChatResponse = createAsyncThunk<
  string, // 성공 시 반환 타입
  string, // 입력으로 받는 파라미터 타입
  { rejectValue: string } // 실패 시 반환 타입
>('chat/fetchChatResponse', async (prompt, { rejectWithValue }) => {
  try {
    const response = await axios.post<ChatResponse>('/api/chat', { prompt });
    return response.data.choices[0].message.content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setPrompt(state, action) {
      state.prompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchChatResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching response';
      });
  },
});

export const { setPrompt } = chatSlice.actions;
export default chatSlice.reducer;
