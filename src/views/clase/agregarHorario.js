import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, InputLabel, FormControl, Button, Typography, Box, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import * as ManagerCookies from "../ManagerCookies";

const ClassAddSchedule = () => {
  const { id } = useParams(); // ID de la clase
  const [schedules, setSchedules] = useState([]);
  const [scheduleName, setScheduleName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/clase/${id}`, {
          withCredentials: true,
        });
        setSchedules(response.data.data.general_schedule);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching class data:', error);
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const handleAddSchedule = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`${config.API_URL}/clase/${id}/agregar-horario`, {
        name: scheduleName,
        dia: dayOfWeek,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSchedules([...schedules, response.data.data]);
        setScheduleName('');
        setDayOfWeek('');
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleAddSubSchedule = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`${config.API_URL}/clase/${id}/agregar-horario-tiempo`, {
        horario_id: selectedScheduleId,
        startTime,
        endTime,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const updatedSchedules = schedules.map(schedule => 
          schedule._id === selectedScheduleId ? { ...schedule, time: [...schedule.time, response.data.data] } : schedule
        );
        setSchedules(updatedSchedules);
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
      console.error('Error adding sub-schedule:', error);
    }
  };

  const handleRemoveSchedule = async (scheduleId) => {
    try {
      const response = await axios.patch(`${config.API_URL}/clase/${id}/quitar-horario`, {
        horario_id: scheduleId,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSchedules(schedules.filter(schedule => schedule._id !== scheduleId));
      }
    } catch (error) {
      console.error('Error removing schedule:', error);
    }
  };

  const handleRemoveSubSchedule = async (scheduleId, subScheduleId) => {
    try {
      const response = await axios.patch(`${config.API_URL}/clase/${id}/quitar-horario-tiempo`, {
        horario_id: scheduleId,
        subHorario_id: subScheduleId,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const updatedSchedules = schedules.map(schedule => 
          schedule._id === scheduleId ? { ...schedule, time: schedule.time.filter(subSchedule => subSchedule._id !== subScheduleId) } : schedule
        );
        setSchedules(updatedSchedules);
      }
    } catch (error) {
      console.error('Error removing sub-schedule:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestionar Horarios de la Clase</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box component="form" onSubmit={handleAddSchedule} sx={{ mb: 3 }}>
            <TextField
              label="Nombre del Horario"
              variant="outlined"
              fullWidth
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Día de la Semana</InputLabel>
              <Select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                label="Día de la Semana"
              >
                {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">Agregar Horario</Button>
          </Box>

          <Box component="form" onSubmit={handleAddSubSchedule} sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>ID del Horario</InputLabel>
              <Select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                label="ID del Horario"
              >
                {schedules.map(schedule => (
                  <MenuItem key={schedule._id} value={schedule._id}>
                    {schedule.name} - {schedule.day_of_week}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Hora de Inicio"
              variant="outlined"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Hora de Fin"
              variant="outlined"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" type="submit">Agregar Sub-Horario</Button>
          </Box>

          <Typography variant="h5" gutterBottom>Horarios Existentes</Typography>
          {schedules.map(schedule => (
            <Box key={schedule._id} sx={{ mb: 3 }}>
              <Typography variant="h6">{schedule.name} - {schedule.day_of_week}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleRemoveSchedule(schedule._id)} sx={{ mb: 2 }}>Eliminar Horario</Button>
              <Typography variant="subtitle1">Sub-Horarios:</Typography>
              {schedule.time.map(subSchedule => (
                <Box key={subSchedule._id} sx={{ ml: 3, mb: 1 }}>
                  <Typography variant="body1">Inicio: {subSchedule.start_time}, Fin: {subSchedule.end_time}</Typography>
                  <Button variant="contained" color="error" onClick={() => handleRemoveSubSchedule(schedule._id, subSchedule._id)}>Eliminar Sub-Horario</Button>
                </Box>
              ))}
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

export default ClassAddSchedule;
