import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import {Login,Register} from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import Users from './pages/Users';
export default function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route index element={<Navigate to="/dashboard" replace/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="donors" element={<Donors/>}/><Route path="inventory" element={<Inventory/>}/><Route path="donations" element={<Donations/>}/><Route path="requests" element={<Requests/>}/><Route element={<ProtectedRoute adminOnly/>}><Route path="users" element={<Users/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></BrowserRouter></AuthProvider>}
