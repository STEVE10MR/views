import React, { useEffect, useState } from 'react';
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Pagination, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import * as ManagerCookies from "../ManagerCookies";

const EstudiantesIndex = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const navigate = useNavigate();
  
  const userRole = ManagerCookies.getCookie('userRole');

  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      let active = true;
      if (['admin', 'jefe proyecto'].includes(userRole)) {
        active = undefined;
      }

      const response = await axios.get(`${config.API_URL}/estudiante`, {
        params: {
          limit: rowsPerPage,
          sort: sortField,
          [`or[0][0][name][regex]`]: search,
          active
        },
        withCredentials: true,
      });
      
      if (response.data && response.data.data) {
        setEstudiantes(response.data.data);
      } else {
        setEstudiantes([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching estudiantes:', error);
      setEstudiantes([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
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
    navigate('/dashboard/student-management/register');
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/student-management/${id}`);
  };

  const handleActivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/estudiante/${id}/activar`, {}, {
        withCredentials: true,
      });
      fetchEstudiantes();
    } catch (error) {
      console.log('Error activating estudiante:', error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/estudiante/${id}/desactivar`, {}, {
        withCredentials: true,
      });
      fetchEstudiantes();
    } catch (error) {
      console.log('Error deactivating estudiante:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Estudiantes</Typography>
      <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mb: 2 }}>
        Registrar Estudiante
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Nombre del Estudiante"
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
                <TableCell>Código</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.length > 0 ? (
                estudiantes.map(estudiante => (
                  <TableRow key={estudiante._id}>
                    <TableCell>{estudiante.name}</TableCell>
                    <TableCell>{estudiante.code}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(estudiante._id)}>
                        EDITAR
                      </Button>
                      {['admin', 'jefe proyecto'].includes(userRole) && (
                        <>
                          {estudiante.active ? (
                            <Button variant="contained" color="error" onClick={() => handleDesactivar(estudiante._id)}>
                              DESACTIVAR
                            </Button>
                          ) : (
                            <Button variant="contained" color="primary" onClick={() => handleActivar(estudiante._id)}>
                              ACTIVAR
                            </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No se encontraron estudiantes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(estudiantes.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default EstudiantesIndex;
