import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, InputLabel, FormControl, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import * as ManagerCookies from "../ManagerCookies";

const ClassAddStudent = () => {
  const { id } = useParams(); // ID de la clase
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/estudiante`, {
          withCredentials: true,
        });
        setStudents(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`${config.API_URL}/clase/${id}/agregar-estudiante`, {
        studen_id: studentId,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate(`/dashboard/clase-management/${id}`);
      }
    } catch (error) {
      console.error('Error adding student to class:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Agregar Estudiante a la Clase</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {loading ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>ID del Estudiante</InputLabel>
            <Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              label="ID del Estudiante"
            >
              {students.map(student => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button variant="contained" color="primary" type="submit">Agregar Estudiante</Button>
      </Box>
    </Container>
  );
};

export default ClassAddStudent;
