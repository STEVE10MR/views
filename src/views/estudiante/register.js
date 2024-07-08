import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, CircularProgress, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const RegisterEstudiante = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    codigo: '',
    imagen: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      imagen: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('codigo', formData.codigo);
    if (formData.imagen) {
      data.append('imagen', formData.imagen);
    }

    try {
      setLoading(true);
      const response = await axios.post(`${config.API_URL}/estudiante`, data, {
        withCredentials: true,
      });
      console.log('Estudiante registrado:', response.data);
      setLoading(false);
      navigate('/dashboard/student-management');
    } catch (error) {
      console.error('Error registrando estudiante:', error);
      setError('Error registrando estudiante');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <IconButton onClick={() => navigate('/dashboard/student-management')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ ml: 1 }}>Registrar Estudiante</Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Código"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Subir Imagen
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Registrar
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RegisterEstudiante;
