import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import {
  obtenerRecorridos,
  actualizarRecorrido,
  eliminarRecorrido
} from '../firebase/recorridosService';

export default function EditarRecorrido({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recorrido, setRecorrido] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarRecorrido() {
      try {
        const datos = await obtenerRecorridos(userId);
        const encontrado = datos.find((item) => item.id === id);

        if (!encontrado) {
          setError('No encontramos este recorrido.');
          return;
        }

        setRecorrido(encontrado);
        setNombre(encontrado.nombre || '');
        setDescripcion(encontrado.descripcion || '');
      } catch (error) {
        console.error('Error al cargar el recorrido:', error);
        setError('No se pudo cargar el recorrido.');
      } finally {
        setCargando(false);
      }
    }

    cargarRecorrido();
  }, [id, userId]);

  async function guardarCambios(evento) {
    evento.preventDefault();

    if (!nombre.trim()) {
      setError('El recorrido necesita un nombre.');
      return;
    }

    try {
      setGuardando(true);
      setError('');

      await actualizarRecorrido(
        id,
        {
          nombre: nombre.trim(),
          descripcion: descripcion.trim()
        },
        userId
      );

      navigate('/mis-recorridos');
    } catch (error) {
      console.error('Error al actualizar el recorrido:', error);
      setError('No se pudieron guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  }

  async function borrarRecorrido() {
    const confirmar = window.confirm(
      '¿Estás seguro de que querés eliminar este recorrido?'
    );

    if (!confirmar) return;

    try {
      await eliminarRecorrido(id);
      navigate('/mis-recorridos');
    } catch (error) {
      console.error('Error al eliminar el recorrido:', error);
      setError('No se pudo eliminar el recorrido.');
    }
  }

  if (cargando) {
    return <p>Cargando recorrido...</p>;
  }

  if (error && !recorrido) {
    return (
      <>
        <Navbar />
        <main className="pagina-edicion">
          <p role="alert">{error}</p>
          <Link to="/mis-recorridos">VOLVER A MIS RECORRIDOS</Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!recorrido) return null;

  const primerTemplo = recorrido.templos?.[0];

  return (
    <>
      <Navbar />

      <main className="pagina-edicion">
        <Link to="/mis-recorridos" className="volver">
          ← MIS RECORRIDOS
        </Link>

        <header className="encabezado-pagina">
          <h1>EDITÁ TU RECORRIDO</h1>
        </header>

        <form className="formulario-edicion" onSubmit={guardarCambios}>
          <div className="campo-formulario">
            <label htmlFor="nombre-recorrido">
              Nombre del recorrido
            </label>

            <input
              id="nombre-recorrido"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="descripcion-recorrido">
              Descripción (Opcional)
            </label>

            <textarea
              id="descripcion-recorrido"
              value={descripcion}
              onChange={(evento) => setDescripcion(evento.target.value)}
              rows={4}
              placeholder="Agregá una nota sobre este recorrido..."
            />
          </div>

          <section className="detalle-templos">
            <h2>Templos de tu recorrido</h2>

            {primerTemplo && (
              <div className="templo-principal">
                <img
                  src={primerTemplo.imagen}
                  alt={primerTemplo.nombre}
                />
              </div>
            )}

            <ol className="lista-templos-edicion">
              {recorrido.templos?.map((templo, indice) => (
                <li key={templo.id}>
                  <span>0{indice + 1}</span>

                  <div>
                    <h3>{templo.nombre}</h3>
                    <p>{templo.zona}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {error && <p role="alert">{error}</p>}

          <div className="acciones-edicion">
            <button
              type="submit"
              className="boton-principal"
              disabled={guardando}
            >
              {guardando ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>

            <button
              type="button"
              className="boton-eliminar"
              onClick={borrarRecorrido}
            >
              ELIMINAR RECORRIDO
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}