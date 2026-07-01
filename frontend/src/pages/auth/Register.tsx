import React,{useState} from 'react'
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
const Register = () => {
     const [firstName, setFirstName] = useState<string>('');
     const [lastName, setLastName] = useState<string>('');
     const [email, setEmail] = useState<string>('');
     const [password, setPassword] = useState<string>('');  
      
  return (
    <>
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            autoComplete="firstName"
            autoFocus
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            autoComplete="lastName"
            autoFocus
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="email"
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
            Sign up
          </Button>
        </Box>
      </Paper>
    </Container>
     {/* <Typography variant="body2" align="center" sx={{ mt: 2 }}>
  Already have an account?{' '}
  <Link 
    to="/login">Log in
  </Link>
</Typography> */}
    </>
  )
}

export default Register
