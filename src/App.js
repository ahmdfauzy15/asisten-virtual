import React from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OpenAI } from 'openai';
import { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #4e54c8, #8f94fb); /* Gradient background */
  color: #fff; /* Text color */
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  padding: 10px;
  text-align: center;
`;

const ChatBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.fromAssistant ? 'flex-start' : 'flex-end')};
  margin-bottom: 10px;
  animation: fadeIn 0.5s; /* Fade-in animation */
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.fromAssistant ? '#fff' : '#007bff')};
  color: ${(props) => (props.fromAssistant ? '#000' : '#fff')};
  margin-bottom: 10px;
`;
const InputMessage = styled.input`
  width: 100%; /* Updated to 100% for responsiveness */
  padding: 30px;
  border: none;
  border-top: 1px solid #ccc;
  outline: none;
  margin-bottom: 5px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  color: ${(props) => (props.fromAssistant ? '#000' : '#000')};
`;

const SendButton = styled(Button)`
  width: 100%; /* Updated to 100% for responsiveness */
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
`;

const Logo = styled.image`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;
const PARAMS = {
  temperature: 0.5,
  max_tokens: 256,
};

const configuration = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const prompt = userInput;
    const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions"; // Replace with your updated API endpoint
    const body = { ...PARAMS, prompt };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configuration.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      const newMessage = {
        text: data.choices && data.choices.length > 0 ? data.choices[0].text : 'No response',
        fromAssistant: true,
      };

      setChatHistory([...chatHistory, newMessage]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setChatHistory([...chatHistory, { text: 'Error fetching data', fromAssistant: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer className='mt-3'>
      <Logo src='https://www.pexels.com/photo/monitor-screen-with-openai-logo-on-black-background-15863044/' alt='Logo' />
      <ChatHeader>Virtual Assistant</ChatHeader>
      <ChatBody>
        {chatHistory.map((msg, index) => (
          <MessageContainer key={index} fromAssistant={msg.fromAssistant}>
            <Message fromAssistant={msg.fromAssistant}>{msg.text}</Message>
          </MessageContainer>
        ))}
      </ChatBody>
      <Form onSubmit={handleSendData}>
        <InputMessage
          type='text'
          placeholder='Type a message...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <SendButton variant='info' type='submit' className='mt-3'>
          Send
        </SendButton>
      </Form>
      <div className='mt-3'>{isLoading ? <Spinner animation='border' /> : null}</div>
    </ChatContainer>
  );
}

export default App;