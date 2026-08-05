import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', carnet: '', carrera: '', email: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (token) {
      cargarAlumnos();
    }
  }, [token]);

  // --- AUTENTICACIÓN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(res.data.token || 'logged_in');
      localStorage.setItem('token', res.data.token || 'logged_in');
    } catch (err) {
      alert('Error en el inicio de sesión: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  // --- CRUD ALUMNOS ---
  const cargarAlumnos = async () => {
    try {
      const res = await axios.get(`${API_URL}/alumnos`);
      setAlumnos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAlumno = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/alumnos/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/alumnos`, form);
      }
      setForm({ nombre: '', apellido: '', carnet: '', carrera: '', email: '' });
      cargarAlumnos();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (alumno) => {
    setEditId(alumno.id);
    setForm(alumno);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Deseas eliminar este alumno?')) {
      try {
        await axios.delete(`${API_URL}/alumnos/${id}`);
        cargarAlumnos();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Iniciar Sesión</h2>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="border border-slate-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="border border-slate-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Sistema de Gestión de Alumnos</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm">
            Cerrar Sesión
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmitAlumno} className="bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-lg font-semibold text-slate-700">
            {editId ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
          </h2>
          <input type="text" placeholder="Nombre" className="border p-2 rounded" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <input type="text" placeholder="Apellido" className="border p-2 rounded" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
          <input type="text" placeholder="Carnet" className="border p-2 rounded" value={form.carnet} onChange={(e) => setForm({ ...form, carnet: e.target.value })} required />
          <input type="text" placeholder="Carrera" className="border p-2 rounded" value={form.carrera} onChange={(e) => setForm({ ...form, carrera: e.target.value })} required />
          <input type="email" placeholder="Correo electrónico" className="border p-2 rounded md:col-span-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          
          <div className="col-span-full flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', apellido: '', carnet: '', carrera: '', email: '' }); }} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="p-3">Carnet</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Carrera</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {alumnos.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{a.carnet}</td>
                  <td className="p-3">{a.nombre} {a.apellido}</td>
                  <td className="p-3">{a.carrera}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(a)} className="bg-amber-500 text-white px-3 py-1 rounded text-xs">Editar</button>
                    <button onClick={() => handleDelete(a.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                  </td>
                </tr>
              ))}
              {alumnos.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-400">No hay alumnos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}