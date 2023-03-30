import { useContext } from 'react';
import { AuthContext, ChatApiContext } from '../contexts/index.js';

const useAuth = () => useContext(AuthContext);
const useChatApi = () => useContext(ChatApiContext);

export { useAuth, useChatApi };
