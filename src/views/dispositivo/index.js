import React, { useEffect, useState } from 'react';
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import * as ManagerCookies from "../ManagerCookies";

const DispositivosIndex = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  
  const userRole = ManagerCookies.getCookie('userRole');

  const fetchDispositivos = async () => {
    setLoading(true);
    try {
      let active = true;
      if (['admin', 'jefe proyecto'].includes(userRole)) {
        active = undefined;
      }

      const response = await axios.get(`${config.API_URL}/dispositivo`, {
        params: {
          limit: rowsPerPage,
          sort: sortField,
          [`or[0][0][name][regex]`]: search,
          active
        },
        withCredentials: true,
      });
      
      if (response.data && response.data.data) {
        setDispositivos(response.data.data);
      } else {
        setDispositivos([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching dispositivos:', error);
      setDispositivos([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispositivos();
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

  const handleActivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/dispositivo/${id}/activar`, {}, {
        withCredentials: true,
      });
      fetchDispositivos();
    } catch (error) {
      console.log('Error activating dispositivo:', error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await axios.patch(`${config.API_URL}/dispositivo/${id}/desactivar`, {}, {
        withCredentials: true,
      });
      fetchDispositivos();
    } catch (error) {
      console.log('Error deactivating dispositivo:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Dispositivos</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Nombre del Dispositivo"
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
                <TableCell>Status</TableCell>
                <TableCell>Última Actividad</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispositivos.length > 0 ? (
                dispositivos.map(dispositivo => (
                  <TableRow key={dispositivo._id}>
                    <TableCell>{dispositivo.name}</TableCell>
                    <TableCell>{dispositivo.status}</TableCell>
                    <TableCell>{dispositivo.last_active}</TableCell>
                    <TableCell>
                      {['admin', 'jefe proyecto'].includes(userRole) && (
                        <>
                          {dispositivo.active ? (
                            <Button variant="contained" color="error" onClick={() => handleDesactivar(dispositivo._id)}>
                              DESACTIVAR
                            </Button>
                          ) : (
                            <Button variant="contained" color="primary" onClick={() => handleActivar(dispositivo._id)}>
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
                  <TableCell colSpan={4} align="center">
                    No se encontraron dispositivos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(dispositivos.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default DispositivosIndex;
