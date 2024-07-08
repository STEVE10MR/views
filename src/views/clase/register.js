import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const ClassRegister = () => {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('667ebdd6613304f9f6232b06'); // Fijado según la solicitud
  const [courseId, setCourseId] = useState('');
  const [attendanceWindow, setAttendanceWindow] = useState(10);
  const [lateWindow, setLateWindow] = useState(30);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/curso`, {
          headers: {
            Authorization: `Bearer ${ManagerCookies.getCookie('token')}`,
          },
        });
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}/clase`, {
        name,
        device_id: deviceId,
        course_id: courseId,
        attendance_window: attendanceWindow,
        late_window: lateWindow,
      }, {
        withCredentials: true,
      });
      if (response.status === 201) {
        navigate('/dashboard/clase-management');
      }
    } catch (error) {
      console.error('Error registering class:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Registrar Clase</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre de la Clase"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>ID del Curso</InputLabel>
            <Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              label="ID del Curso"
            >
              {courses.map(course => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          label="Ventana de Asistencia (minutos)"
          variant="outlined"
          fullWidth
          value={attendanceWindow}
          onChange={(e) => setAttendanceWindow(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Ventana de Tardanza (minutos)"
          variant="outlined"
          fullWidth
          value={lateWindow}
          onChange={(e) => setLateWindow(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" type="submit">Registrar</Button>
      </Box>
    </Container>
  );
};

export default ClassRegister;
