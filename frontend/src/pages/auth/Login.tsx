import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { loginUser,getCurrentUser } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../../context/AuthContext';
export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');  
  
  const {login,setUser} = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  const data = await loginUser(email, password);
  login(data.token);
  const userData=await getCurrentUser();
  setUser(userData);
  setEmail('')
  setPassword('')
  
   navigate("/dashboard");
};

  return (
    <>
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
    {/* <Typography variant="body2" align="center" sx={{ mt: 2 }}>
  Don't have an account?{' '}
  <Link 
    to="/signup">Sign up
  </Link>
</Typography> */}
  </>
  );
}