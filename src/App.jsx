import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { auth, db } from './firebase/config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import MisRecorridos from './pages/MisRecorridos';
import EditarRecorrido from './pages/EditarRecorrido';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorAuth, setErrorAuth] = useState('');

  const [templos, setTemplos] = useState([]);
  const [cargandoTemplos, setCargandoTemplos] = useState(true);
  const [errorTemplos, setErrorTemplos] = useState('');

  // Autenticación anónima
  useEffect(() => {
    const cancelarSuscripcion = onAuthStateChanged(auth, (usuarioActual) => {
      if (usuarioActual) {
        setUsuario(usuarioActual);
        setCargandoAuth(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Error al iniciar sesión:', error);
          setErrorAuth('No se pudo iniciar la sesión.');
          setCargandoAuth(false);
        });
      }
    });

    return () => cancelarSuscripcion();
  }, []);

  // Carga de templos desde Firestore
  useEffect(() => {
    if (!usuario) return;

    async function cargarTemplos() {
      setCargandoTemplos(true);
      setErrorTemplos('');

      try {
        const referencia = collection(db, 'templos');
        const resultado = await getDocs(referencia);

        const datosTemplos = resultado.docs.map((documento) => ({
          ...documento.data()
        }));

        datosTemplos.sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es')
        );

        setTemplos(datosTemplos);
      } catch (error) {
        console.error('Error al cargar los templos:', error);
        setErrorTemplos('No se pudo cargar el catálogo de templos.');
      } finally {
        setCargandoTemplos(false);
      }
    }

    cargarTemplos();
  }, [usuario]);

  if (cargandoAuth) {
    return <p>Preparando tu sesión...</p>;
  }

  if (errorAuth) {
    return <p>{errorAuth}</p>;
  }

  if (cargandoTemplos) {
    return <p>Cargando templos...</p>;
  }

  if (errorTemplos) {
    return <p>{errorTemplos}</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Inicio
            templos={templos}
            userId={usuario.uid}
          />
        }
      />

      <Route
        path="/catalogo"
        element={
          <Catalogo templos={templos} />
        }
      />

      <Route
        path="/mis-recorridos"
        element={
          <MisRecorridos userId={usuario.uid} />
        }
      />

      <Route
        path="/mis-recorridos/:id/editar"
        element={
          <EditarRecorrido userId={usuario.uid} />
        }
      />
    </Routes>
  );
}
