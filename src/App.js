import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/auth/login';
import Layout from './views/Layout';
import UserManagement from './views/Usuario/index';
import UserManagementRegister from './views/Usuario/register';
import UserManagementEdit from './views/Usuario/edit';
import CurseIndex from './views/curso/index'
import CurseEdit from './views/curso/edit'
import CurseRegistrar from './views/curso/register'
import Estudiante from './views/estudiante/index';
import Estudianteedit from './views/estudiante/edit';
import Estudianteregister from './views/estudiante/register';
import DispositivoIndex from './views/dispositivo/index';

import Class from './views/clase/index';
import Classedit from './views/clase/edit';
import Classregister from './views/clase/register';
import ClassHorarioRegistrar from './views/clase/agregarHorario';
import ClassEstudianteRegistrar from './views/clase/agregarEstudiante';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Layout />}>
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/register" element={<UserManagementRegister />} />
          <Route path="user-management/edit/:id" element={<UserManagementEdit />} />
          <Route path="device-management" element={<DispositivoIndex/>} />
          <Route path="course-management" element={<CurseIndex />} />
          <Route path="course-management/:id" element={<CurseEdit />} />
          <Route path="course-management/register" element={<CurseRegistrar />} />
          <Route path="student-management" element={<Estudiante />} />
          <Route path="student-management/:id" element={<Estudianteedit />} />
          <Route path="student-management/register" element={<Estudianteregister />} />
          <Route path="clase-management" element={<Class />} />
          <Route path="clase-management/:id" element={<Classedit />} />
          <Route path="clase-management/register" element={<Classregister />} />
          <Route path="clase-management/:id/students/register" element={<ClassEstudianteRegistrar />} />
          <Route path="clase-management/:id/schedule/register" element={<ClassHorarioRegistrar />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
