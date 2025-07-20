import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Field,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';

const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const ResetPassword = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = query.get('email');
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password, password_confirmation: confirmPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful!');
        navigate('/signin');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      <Container maxW="md" py={12}>
        <Box boxShadow="xl" borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.200" p={8}>
          <VStack spacing={6}>
            <Heading size="lg" color="gray.900">Reset Password</Heading>
            <Text color="gray.600">Enter your new password below.</Text>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} w="full">
                <Field.Root invalid={!!error}>
                  <Field.Label>New Password</Field.Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                </Field.Root>
                <Field.Root invalid={!!error}>
                  <Field.Label>Confirm Password</Field.Label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
                  {error && <Field.ErrorText>{error}</Field.ErrorText>}
                </Field.Root>
                <Button type="submit" colorPalette="blue" loading={loading} w="full">Reset Password</Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;