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
  const [filtro, setFiltro] = useState('');

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/30 rounded-2xl overflow-hidden relative">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
          
          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Iniciar Sesión</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Control de Registro de Estudiantes</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-2 flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtrado local de alumnos
  const alumnosFiltrados = alumnos.filter((a) => {
    const query = filtro.toLowerCase();
    return (
      (a.nombre || '').toLowerCase().includes(query) ||
      (a.apellido || '').toLowerCase().includes(query) ||
      (a.carnet || '').toLowerCase().includes(query) ||
      (a.carrera || '').toLowerCase().includes(query) ||
      (a.email || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header de Navegación */}
        <header className="bg-white border border-slate-200/80 p-4 px-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Control de Alumnos
              </h1>
              <p className="text-xs text-slate-500 font-medium">Sistema de Gestión Académica</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-semibold text-slate-600">Sesión Activa</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition duration-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Formulario (Columna Izquierda) */}
          <section className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {editId ? (
                  <>
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span>Editar Alumno</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-600">Edición</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Agregar Alumno</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Completa los campos para registrar o actualizar la información del estudiante.</p>
            </div>

            <form onSubmit={handleSubmitAlumno} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    value={form.nombre} 
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                    required 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Apellido</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Pérez" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    value={form.apellido} 
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carnet</label>
                <input 
                  type="text" 
                  placeholder="Ej. 2023-0001" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  value={form.carnet} 
                  onChange={(e) => setForm({ ...form, carnet: e.target.value })} 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carrera</label>
                <input 
                  type="text" 
                  placeholder="Ej. Ingeniería en Sistemas" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  value={form.carrera} 
                  onChange={(e) => setForm({ ...form, carrera: e.target.value })} 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="Ej. juan.perez@universidad.edu" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button 
                  type="submit" 
                  className={`flex-grow flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-150 cursor-pointer ${
                    editId 
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10 hover:shadow-amber-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 hover:shadow-indigo-500/20'
                  }`}
                >
                  {editId ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Actualizar
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Guardar
                    </>
                  )}
                </button>
                
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditId(null); setForm({ nombre: '', apellido: '', carnet: '', carrera: '', email: '' }); }} 
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors duration-150 cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Tabla de Alumnos (Columna Derecha) */}
          <section className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Controles de la Tabla */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  Listado de Alumnos
                  <span className="text-[11px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                    {alumnos.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {filtro 
                    ? `Filtrados: ${alumnosFiltrados.length} alumno(s)` 
                    : 'Registro completo de alumnos matriculados.'}
                </p>
              </div>

              {/* Input de Búsqueda Local */}
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Buscar alumno, carnet, carrera..." 
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                {filtro && (
                  <button 
                    onClick={() => setFiltro('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Vista de Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/75 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider pl-6 w-[15%]">Carnet</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">Nombre Completo</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Carrera</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Email</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-6 w-[10%]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {alumnosFiltrados.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="p-4 pl-6">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/40 inline-block">
                          {a.carnet}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{a.nombre} {a.apellido}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                          {a.carrera}
                        </span>
                      </td>
                      <td className="p-4">
                        <a 
                          href={`mailto:${a.email}`} 
                          className="text-xs text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5 font-medium"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          {a.email}
                        </a>
                      </td>
                      <td className="p-4 text-right pr-6 whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleEdit(a)} 
                            title="Editar Alumno"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100/50 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(a.id)} 
                            title="Eliminar Alumno"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100/50 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.24 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {alumnosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <p className="text-sm font-semibold text-slate-600">No se encontraron alumnos</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                            {filtro 
                              ? 'Intenta buscar con otros términos o limpia el filtro.' 
                              : 'Registra un alumno en el formulario de la izquierda para comenzar.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer de la Tabla */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
              <span>Búsqueda en tiempo real habilitada</span>
              <span>Total alumnos: {alumnos.length}</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}