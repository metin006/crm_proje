import { Grid, Paper, Typography, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

const stats = [
  {
    title: 'İstifadəçilər',
    value: 134,
    icon: <PeopleIcon sx={{ color: '#3f51b5' }} fontSize="large" />,
    bg: '#e8eaf6',
  },
  {
    title: 'Kateqoriyalar',
    value: 12,
    icon: <CategoryIcon sx={{ color: '#4caf50' }} fontSize="large" />,
    bg: '#e8f5e9',
  },
  {
    title: 'FAQ-lar',
    value: 45,
    icon: <QuizIcon sx={{ color: '#ff9800' }} fontSize="large" />,
    bg: '#fff8e1',
  },
  {
    title: 'Əməliyyatlar',
    value: 78,
    icon: <TrendingUpIcon sx={{ color: '#f44336' }} fontSize="large" />,
    bg: '#ffebee',
  },
];


const recentActions = [
  'Yeni istifadəçi əlavə olundu',
  'Kateqoriya "Texnologiya" yaradıldı',
  'FAQ: "React nədir?" əlavə edildi',
  'Admin panelə daxil oldu',
];

const Home = () => {
  const [username, setUsername] = useState('');
  const [loginTime, setLoginTime] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || 'İstifadəçi');
    }

    const now = new Date();
    const time = now.toLocaleTimeString('az-Latn-AZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLoginTime(time);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      
      <Typography variant="h4" gutterBottom>
        Xoş gəldin, {username} 
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Giriş vaxtı: {loginTime}
      </Typography>

   
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                background: stat.bg,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5">{stat.value}</Typography>
                </Box>
                <Box>{stat.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Son Əməliyyatlar
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentActions.map((action, i) => (
                <ListItem key={i}>
                  <ListItemText primary={action} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

      
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aktiv İstifadəçilər
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography>• metin006 (Admin)</Typography>
            <Typography>• gunel2002 (HR)</Typography>
            <Typography>• rashad.dev (Frontend)</Typography>
            <Typography>• elvinx (Support)</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
