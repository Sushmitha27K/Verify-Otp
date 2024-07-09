import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-otp', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else if (error.request) {
        setMessage('No response received from server');
        console.error('Error request:', error.request);
      } else {
        setMessage('Error in sending request');
        console.error('Error message:', error.message);
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-otp', { email, otp });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else if (error.request) {
        setMessage('No response received from server');
        console.error('Error request:', error.request);
      } else {
        setMessage('Error in sending request');
        console.error('Error message:', error.message);
      }
    }
  };

  const checkConnection = async () => {
    try {
      const response = await axios.get('http://localhost:3001/');
      if (response.status === 200) {
        setMessage('Connected to backend successfully');
      }
    } catch (error) {
      setMessage('Failed to connect to backend');
    }
  };

  return (
    <div className="App">
      <h1>Email OTP Verification</h1>
      {/* <button onClick={checkConnection}>Check Backend Connection</button> */}
      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;
