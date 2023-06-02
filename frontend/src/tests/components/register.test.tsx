import React, { useState } from 'react';
import axios from 'axios';
import { Container, Center, TextInput, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

const RegisterView = (): JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users', {
        name,
        email,
        password,
      });
      console.log('User created successfully');
      navigate('/login');
    } catch (error:any) {
      console.log('Failed to create user:', error.message);
    }
  };
  return (
  <Container size="sm">
  <Center style={{ height: '100vh' }}>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <TextInput
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label>
        Email:
        <TextInput
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password:
        <TextInput
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <Button type="submit">Register</Button>
      <div style={{ marginTop: '1rem' }}>
      <Link to="/login">Already have an account? log in</Link>
      </div>
    </form>
  </Center>
</Container>
  );
};

export default RegisterView;