import React, { useEffect, useState } from 'react';
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Pagination, CircularProgress, MenuItem, Select, InputLabel, FormControl, Collapse } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import * as ManagerCookies from "../ManagerCookies";

const ClasesIndex = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [expandedClass, setExpandedClass] = useState(null);
  const navigate = useNavigate();

  const userRole = ManagerCookies.getCookie('userRole');

  const fetchClases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/clase`, {
        params: {
          limit: rowsPerPage,
          sort: sortField,
          [`or[0][0][name][regex]`]: search,
        },
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setClases(response.data.data);
      } else {
        setClases([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching clases:', error);
      setClases([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, [page, rowsPerPage, search, sortField, userRole]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleRegister = () => {
    navigate('/dashboard/clase-management/register');
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/clase-management/${id}`);
  };

  const handleActivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/clase/${id}/activar`, {}, {
        withCredentials: true,
      });
      fetchClases();
    } catch (error) {
      console.log('Error activating clase:', error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/clase/${id}/desactivar`, {}, {
        withCredentials: true,
      });
      fetchClases();
    } catch (error) {
      console.log('Error deactivating clase:', error);
    }
  };

  const handleAddStudent = (id) => {
    navigate(`/dashboard/clase-management/${id}/students/register`);
  };

  const handleAddSchedule = (id) => {
    navigate(`/dashboard/clase-management/${id}/schedule/register`);
  };

  const handleExpandClick = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleRemoveStudent = async (classId, studentId) => {
    try {
      await axios.patch(`${config.API_URL}/clase/${classId}/quitar-estudiante`, {
        studen_id: studentId,
      }, {
        withCredentials: true,
      });
      fetchClases();
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Clases</Typography>
      <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mb: 2 }}>
        Registrar Clase
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Nombre de la Clase"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <FormControl variant="outlined" sx={{ width: '200px' }}>
          <InputLabel>Ordenar Por</InputLabel>
          <Select
            value={sortField}
            onChange={handleSortFieldChange}
            label="Ordenar Por"
          >
            <MenuItem value="createdAt">Fecha de Creación</MenuItem>
            <MenuItem value="name">Nombre</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100px' }}>
          <InputLabel>Limite</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Limite"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clases.length > 0 ? (
                clases.map(clase => (
                  <React.Fragment key={clase._id}>
                    <TableRow>
                      <TableCell>
                        <Button onClick={() => handleExpandClick(clase._id)}>
                          {clase.name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(clase._id)}>
                          EDITAR
                        </Button>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleAddStudent(clase._id)}>
                          AGREGAR ESTUDIANTE
                        </Button>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleAddSchedule(clase._id)}>
                          AGREGAR HORARIO
                        </Button>
                        {['admin', 'jefe proyecto'].includes(userRole) && (
                          <>
                            {clase.active ? (
                              <Button variant="contained" color="error" onClick={() => handleDesactivar(clase._id)}>
                                DESACTIVAR
                              </Button>
                            ) : (
                              <Button variant="contained" color="primary" onClick={() => handleActivar(clase._id)}>
                                ACTIVAR
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Collapse in={expandedClass === clase._id} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="h6" gutterBottom component="div">
                              Horarios
                            </Typography>
                            {clase.general_schedule.map(schedule => (
                              <Box key={schedule._id} margin={1}>
                                <Typography variant="subtitle1">
                                  {schedule.name} - {schedule.day_of_week}
                                </Typography>
                                {schedule.time.map(subSchedule => (
                                  <Typography key={subSchedule._id} variant="body2">
                                    Inicio: {subSchedule.start_time}, Fin: {subSchedule.end_time}
                                  </Typography>
                                ))}
                              </Box>
                            ))}
                            <Typography variant="h6" gutterBottom component="div">
                              Estudiantes
                            </Typography>
                            {clase.students.map(student => (
                              <Box key={student.studen_id._id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                  {student.studen_id.name} - {student.studen_id.code}
                                </Typography>
                                <Button variant="contained" color="error" onClick={() => handleRemoveStudent(clase._id, student.studen_id._id)}>
                                  QUITAR
                                </Button>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No se encontraron clases
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(clases.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default ClasesIndex;
