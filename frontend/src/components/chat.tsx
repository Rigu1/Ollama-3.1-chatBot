import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setPrompt, fetchChatResponse } from '../api/chatSlice';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;  
  height: 100%;
  width: 800px;
  background-color: #1a1a1a;
  color: white;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  min-height: 500px;
  max-height: 500px;
  flex-direction: column;
  gap: 10px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? '#4caf50' : '#333')};
  color: white;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const InputContainer = styled.form`
  display: flex;
  padding: 10px;
  background-color: #1a1a1a;
  border-top: 1px solid #333;

  input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    margin-right: 10px;
    background-color: #333;
    color: white;
  }

  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
  }
`;

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { prompt, response, loading } = useSelector((state: RootState) => state.chat);

  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setMessages((prev) => [...prev, { text: prompt, isUser: true }]);
      dispatch(fetchChatResponse(prompt));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPrompt(e.target.value));
  };

  useEffect(() => {
    if (response) {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      dispatch(setPrompt(''));
    }
  }, [response, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble key={index} isUser={msg.isUser}>
            {msg.text}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={prompt}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          Send
        </button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
