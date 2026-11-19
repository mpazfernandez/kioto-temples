import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TarjetaTemplo from '../components/TarjetaTemplo';

export default function Catalogo({ templos }) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Todas');
  const [cantidadVisible, setCantidadVisible] = useState(9);

  const zonas = [
    ...new Set(templos.map((templo) => templo.zona))
  ].sort((a, b) => a.localeCompare(b));

  const templosFiltrados = templos.filter((templo) =>
    zonaSeleccionada === 'Todas' ||
    templo.zona === zonaSeleccionada
  );

  // Volvemos a mostrar los primeros nueve al cambiar de zona.
  useEffect(() => {
    setCantidadVisible(9);
  }, [zonaSeleccionada]);

  const templosVisibles = templosFiltrados.slice(0, cantidadVisible);

  return (
    <>
      <Navbar />

      <main className="pagina-catalogo">
        <header className="encabezado-pagina">
          <p className="etiqueta">CATÁLOGO</p>
          <h1>TEMPLOS PARA DESCUBRIR</h1>
          <p>
            Explorá los templos budistas de Kioto y descubrí
            su arquitectura, historia y ubicación.
          </p>
        </header>

        <section className="filtros">
          <label htmlFor="filtro-zona">
            Explorar por zona
          </label>

          <select
            id="filtro-zona"
            value={zonaSeleccionada}
            onChange={(evento) =>
              setZonaSeleccionada(evento.target.value)
            }
          >
            <option value="Todas">TODAS LAS ZONAS</option>

            {zonas.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </section>

        <p className="contador-templos" aria-live="polite">
          Mostrando {templosVisibles.length} de {templosFiltrados.length} templos
        </p>

        {templosFiltrados.length === 0 ? (
          <p>No se encontraron templos en esta zona.</p>
        ) : (
          <>
            <section className="grilla" aria-label="Templos budistas">
              {templosVisibles.map((templo) => (
                <TarjetaTemplo
                  key={templo.id}
                  templo={templo}
                />
              ))}
            </section>

            {cantidadVisible < templosFiltrados.length && (
              <button
                type="button"
                className="boton-cargar"
                onClick={() =>
                  setCantidadVisible((cantidad) => cantidad + 9)
                }
              >
                CARGAR MÁS
              </button>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}