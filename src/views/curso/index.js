import React, { useEffect, useState } from 'react';
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Pagination, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import * as ManagerCookies from "../ManagerCookies";

const CursosIndex = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const navigate = useNavigate();
  
  const userRole = ManagerCookies.getCookie('userRole');

  const fetchCursos = async () => {
    setLoading(true);
    try {
      let active = true;
      if (['admin', 'jefe proyecto'].includes(userRole)) {
        active = undefined;
      }

      const response = await axios.get(`${config.API_URL}/curso`, {
        params: {
          limit: rowsPerPage,
          sort: sortField,
          [`or[0][0][name][regex]`]: search,
          active
        },
        withCredentials: true,
      });
      
      if (response.data && response.data.data) {
        setCursos(response.data.data);
      } else {
        setCursos([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching cursos:', error);
      setCursos([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
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
    navigate('/dashboard/course-management/register');
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/course-management/${id}`);
  };

  const handleActivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/curso/${id}/activar`, {}, {
        withCredentials: true,
      });
      fetchCursos();
    } catch (error) {
      console.log('Error activating curso:', error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/curso/${id}/desactivar`, {}, {
        withCredentials: true,
      });
      fetchCursos();
    } catch (error) {
      console.log('Error deactivating curso:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Cursos</Typography>
      <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mb: 2 }}>
        Registrar Curso
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Nombre del Curso"
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
            <MenuItem value="nombre">Nombre</MenuItem>
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
              {cursos.length > 0 ? (
                cursos.map(curso => (
                  <TableRow key={curso._id}>
                    <TableCell>{curso.name}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(curso._id)}>
                        EDITAR
                      </Button>
                      {['admin', 'jefe proyecto'].includes(userRole) && (
                        <>
                          {curso.active ? (
                            <Button variant="contained" color="error" onClick={() => handleDesactivar(curso._id)}>
                              DESACTIVAR
                            </Button>
                          ) : (
                            <Button variant="contained" color="primary" onClick={() => handleActivar(curso._id)}>
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
                  <TableCell colSpan={2} align="center">
                    No se encontraron cursos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(cursos.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default CursosIndex;
