import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
 const navigate = useNavigate();
 const {logout,user} = useAuth();
  const handleLogOut = ()=>{
      logout();
    navigate("/login")
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <p>Hello, {user?.firstName}</p>
        <Button color="inherit" onClick={handleLogOut}>Log out</Button>
      </Toolbar>
    </AppBar>
  );
}

