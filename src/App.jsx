import { useState, useEffect } from 'react';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import TarjetaTemplo from './components/TarjetaTemplo';
import GeneradorRecorridos from './components/GeneradorRecorridos';

export default function App() {

  // Verificación Firebase
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorAuth, setErrorAuth] = useState('');

  // Import templos desde Firebase
  const [templos, setTemplos] = useState([]);
  const [cargandoTemplos, setCargandoTemplos] = useState(true);
  const [errorTemplos, setErrorTemplos] = useState('');

  // 1. Estado del filtro por zona
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Todas');

  // 2. Obtenemos las zonas disponibles sin repetirlas
  const zonas = [
    ...new Set(templos.map((templo) => templo.zona))
  ].sort((a, b) => a.localeCompare(b));

  // 3. Filtramos los templos según la zona elegida
  const templosFiltrados = templos.filter((templo) =>
    zonaSeleccionada === 'Todas' || templo.zona === zonaSeleccionada
  );

  // useEffect para la verificación anónima de Firebase
  useEffect(() => {
    const cancelarSuscripcion = onAuthStateChanged(auth, (usuarioActual) => {
      if (usuarioActual) {
        // Ya existe una sesión
        setUsuario(usuarioActual);
        setCargandoAuth(false);
      } else {
        // No existe una sesión: creamos una anónima
        signInAnonymously(auth)
          .catch((error) => {
            console.error('Error al iniciar sesión:', error);
            setErrorAuth('No se pudo iniciar la sesión.');
            setCargandoAuth(false);
          });
      }
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => cancelarSuscripcion();
  }, []);

  // useEffect para acceder a templos de Firebase
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

        // Ordenamos los templos alfabéticamente
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

  // Condiciones para la autenticación
  if (cargandoAuth) { return <p>Preparando tu sesión...</p>; }
  if (errorAuth) { return <p>{errorAuth}</p>; }

  // Condiciones para cargar templos
  if (cargandoTemplos) return <p>Cargando templos...</p>;
  if (errorTemplos) return <p>{errorTemplos}</p>;

  // 4. Interfaz
  return (
    <main className="contenedor">

      <header>
        <p className="etiqueta">JAPAN · BUDDHIST TEMPLES</p>
        <h1>Templos de Kioto</h1>
        <p>
          Explorá la historia y la arquitectura de los templos
          budistas de Kyoto City.
        </p>
      </header>

      <GeneradorRecorridos
        templos={templos}
        userId={usuario.uid}
      />

      <section className="filtros" aria-label="Filtros de templos">
        <label htmlFor="filtro-zona">
          Explorar por zona
        </label>

        <select
          id="filtro-zona"
          value={zonaSeleccionada}
          onChange={(evento) => setZonaSeleccionada(evento.target.value)}
        >
          <option value="Todas">Todas las zonas</option>

          {zonas.map((zona) => (
            <option key={zona} value={zona}>
              {zona}
            </option>
          ))}
        </select>
      </section>

      <p aria-live="polite">
        {templosFiltrados.length} de {templos.length} templos
      </p>

      {templosFiltrados.length === 0 ? (
        <p className="mensaje">
          No se encontraron templos en esta zona.
        </p>
      ) : (
        <section className="grilla" aria-label="Templos budistas">
          {templosFiltrados.map((templo) => (
            <TarjetaTemplo key={templo.id} templo={templo} />
          ))}
        </section>
      )}

      <footer>
        Información obtenida de{' '}
        <a
          href="https://www.wikidata.org/"
          target="_blank"
          rel="noreferrer"
        >
          Wikidata
        </a>.
      </footer>

    </main>
  );
}
