import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import { registerUser } from '../../services/authServices';
import { useUsers } from '../../context/UsersContext';
const Register = () => {
    const navigate = useNavigate();
    type UserRole = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
     const [firstName, setFirstName] = useState<string>('');
     const [lastName, setLastName] = useState<string>('');
     const [email, setEmail] = useState<string>('');
     const [password, setPassword] = useState<string>('');  
     const [role, setRole] = useState<UserRole>("MEMBER");
     
     const {fetchUsers}=useUsers();

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
     e.preventDefault();

     await registerUser({
     firstName,
     lastName,
     email,
     password,
     role,
    });

  await fetchUsers();

  alert("User created successfully");
  navigate("/dashboard/users")
};
      
  return (
    <>
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setRole(e.target.value as UserRole)
              }
            >
  <MenuItem value="ADMIN">Admin</MenuItem>
  <MenuItem value="PROJECT_MANAGER">Project Manager</MenuItem>
  <MenuItem value="MEMBER">Member</MenuItem>
</TextField>
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
