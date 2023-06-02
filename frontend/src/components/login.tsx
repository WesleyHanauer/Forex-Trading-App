import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Center, Text, TextInput, Button } from '@mantine/core';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <Container size="sm">
      <Center style={{ height: '100vh' }}>
        <form onSubmit={handleSubmit}>
          {errorMessage && <Text color="red">{errorMessage}</Text>}
          <div>
            <label htmlFor="email">Email:</label>
            <TextInput
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <TextInput
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit">Log in</Button>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/register">Don't have an account yet? Register</Link>
          </div>
        </form>
      </Center>
    </Container>
  );
}

export default Login;
