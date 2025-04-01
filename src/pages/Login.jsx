import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';

const schema = yup.object().shape({
  username: yup.string().required('İstifadəçi adı boş ola bilməz'),
  password: yup.string().required('Şifrə boş ola bilməz'),
});

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      navigate('/home');
    },
    onError: () => {
      setErrorMsg('İstifadəçi adı və ya şifrə yanlışdır');
    },
  });

  const onSubmit = (formData) => {
    setErrorMsg('');
    mutate(formData);
  };

  return (
    
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="login-container"
    >
      <Typography variant="h5" gutterBottom className="login-title">
        Daxil ol
      </Typography>

      <TextField
        label="İstifadəçi adı"
        fullWidth
        margin="normal"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
        className="login-input"
      />

      <TextField
        label="Şifrə"
        type="password"
        fullWidth
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        className="login-input"
      />

      {isPending ? (
        <Button variant="contained" fullWidth disabled className="login-button">
          Yüklənir...
        </Button>
      ) : (
        <Button type="submit" variant="contained" fullWidth className="login-button">
          Daxil ol
        </Button>
      )}

      {errorMsg && (
        <Typography className="login-error">
          {errorMsg}
        </Typography>
      )}
    </Box>
  );
};

export default Login;
