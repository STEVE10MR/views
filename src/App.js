import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/auth/login';
import Layout from './views/Layout';
import UserManagement from './views/Usuario/index';
import UserManagementRegister from './views/Usuario/register';
import UserManagementEdit from './views/Usuario/edit';


import dispositivoIndex from './views/dispositivo/index';

import ProjectRequerimentManagementGet from './views/Proyecto/get';
import ProjectRequerimentManagementRegister from './views/Proyecto/register';

import curso from './views/curso/index';
import cursoedit from './views/curso/index';
import cursoregister from './views/curso/index';

import estudiante from './views/estudiante/index';
import estudianteedit from './views/estudiante/index';
import estudianteregister from './views/estudiante/index';
/*
cursor-management
device-management


attendance-management
class-management
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Layout />}>
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/register" element={<UserManagementRegister />} />
          <Route path="user-management/edit/:id" element={<UserManagementEdit />} />

          <Route path="attendance-management" element={<asistenciaIndex />} />
          <Route path="device-management" element={<dispositivoIndex />} />


          <Route path="cursor-management" element={<curso />} />
          <Route path="cursor-management/:id" element={<cursoedit />} />
          <Route path="cursor-management/register" element={<cursoregister />} />

          <Route path="student-management" element={<estudiante />} />
          <Route path="student-management/:id" element={<estudianteedit />} />
          <Route path="student-management/register" element={<estudianteregister />} />

        
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
