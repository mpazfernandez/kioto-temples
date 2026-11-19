import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { obtenerRecorridos } from '../firebase/recorridosService';
import { obtenerNombresIntereses } from '../utils/obtenerCaracteristicas';

export default function MisRecorridos({ userId }) {
  const [recorridos, setRecorridos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarRecorridos() {
      try {
        setCargando(true);
        setError('');

        const datos = await obtenerRecorridos(userId);
        setRecorridos(datos);

      } catch (error) {
        console.error('Error al recuperar recorridos:', error);
        setError('No se pudieron cargar tus recorridos.');

      } finally {
        setCargando(false);
      }
    }

    cargarRecorridos();
  }, [userId]);

  return (
    <>
      <Navbar />

      <main className="pagina-recorridos">
        <header className="encabezado-pagina">
          <p className="etiqueta">MIS RECORRIDOS</p>
          <h1>TUS RECORRIDOS FAVORITOS</h1>
          <p>
            Una selección de lugares para volver a explorar Kioto.
          </p>
        </header>

        {cargando ? (
          <p>Cargando tus recorridos...</p>

        ) : error ? (
          <p role="alert">{error}</p>

        ) : recorridos.length === 0 ? (
          <section className="estado-vacio">
            <h2>Todavía no guardaste recorridos.</h2>
            <p>
              Explorá los templos y creá tu primer recorrido por Kioto.
            </p>

            <Link to="/" className="enlace-seccion">
              DESCUBRIR TEMPLOS
            </Link>
          </section>

        ) : (
          <section className="lista-recorridos">

            {recorridos.map((recorrido) => {
              const intereses = obtenerNombresIntereses(
                recorrido.intereses
              );

              return (
                <article
                  className="item-recorrido"
                  key={recorrido.id}
                >

                  <div className="item-recorrido-imagenes">
                    {recorrido.templos?.slice(0, 3).map((templo) => (
                      <img
                        key={templo.id}
                        src={templo.imagen}
                        alt={templo.nombre}
                        loading="lazy"
                      />
                    ))}
                  </div>

                  <div className="item-recorrido-contenido">

                    <p className="etiqueta">
                      {recorrido.zona || 'KIOTO'} ·
                      <span>
                        {' '}{recorrido.templos?.length || 0} TEMPLOS
                      </span>
                    </p>

                    <h2>{recorrido.nombre}</h2>

                    {recorrido.descripcion && (
                      <p>{recorrido.descripcion}</p>
                    )}

                    {intereses.length > 0 && (
                      <div className="intereses-recorrido">

                        <p className="etiqueta">
                          INTERESES SELECCIONADOS
                        </p>

                        <ul className="lista-intereses-recorrido">
                          {intereses.map((interes) => (
                            <li key={interes}>
                              {interes}
                            </li>
                          ))}
                        </ul>

                      </div>
                    )}

                  </div>

                  <Link
                    to={`/mis-recorridos/${recorrido.id}/editar`}
                    className="enlace-seccion"
                  >
                    EDITAR
                  </Link>

                </article>
              );
            })}

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}