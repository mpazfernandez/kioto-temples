import { useEffect, useState } from 'react';
import TarjetaTemplo from './components/TarjetaTemplo';

export default function App() {
  // 1. Estados de la aplicación
  const [templos, setTemplos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // 2. Consulta a Wikidata
  useEffect(() => {

    async function cargarTemplos() {
      try {
        setCargando(true);
        setError('');

        const consulta = `
          SELECT DISTINCT
            ?temple
            ?templeLabel
            ?areaLabel
            ?founded
            ?image
          WHERE {
            ?temple wdt:P31/wdt:P279* wd:Q5393308;
                    wdt:P131 ?area;
                    wdt:P571 ?founded;
                    wdt:P18 ?image.

            ?area wdt:P131 wd:Q34600.

            SERVICE wikibase:label {
              bd:serviceParam wikibase:language "en,ja".
            }
          }
          ORDER BY ?templeLabel
          LIMIT 60
        `;

        const endpoint = 'https://query.wikidata.org/sparql';

        const parametros = new URLSearchParams({
          query: consulta,
          format: 'json'
        });

        const respuesta = await fetch(
          `${endpoint}?${parametros.toString()}`,
          {
            headers: {
              Accept: 'application/sparql-results+json'
            }
          }
        );

        if (!respuesta.ok) {
          throw new Error('No se pudieron obtener los templos.');
        }

        const datos = await respuesta.json();

        // 3. Transformamos los resultados de Wikidata
        const templosNormalizados = datos.results.bindings.map((item) => {
          const fecha = item.founded.value;
          const año = Number(fecha.match(/[+-]?\d+/)[0]);

          return {
            id: item.temple.value,
            nombre: item.templeLabel.value,
            zona: item.areaLabel?.value ?? 'Zona no especificada',
            antiguedad: new Date().getFullYear() - año,
            imagen: item.image.value
          };
        });

        // 4. Guardamos los templos en el estado
        setTemplos(templosNormalizados);

      } catch (error) {
        console.error('Error al consultar Wikidata:', error);
        setError('No se pudieron cargar los templos. Intentá nuevamente.');
      } finally {
        setCargando(false);
      }
    }

    cargarTemplos();

  }, []);

  // 5. Buscador por nombre
  const templosFiltrados = templos.filter((templo) =>
    templo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 6. Interfaz
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

      <section className="filtros" aria-label="Buscador">
        <label>
          Buscar por nombre
          <input
            type="search"
            placeholder="Por ejemplo: Daitoku-ji"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </label>
      </section>

      {cargando && (
        <p className="mensaje" aria-live="polite">
          Cargando templos...
        </p>
      )}

      {error && (
        <p className="mensaje error" role="alert">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <>
          <p aria-live="polite">
            {templosFiltrados.length} de {templos.length} templos encontrados
          </p>

          {templosFiltrados.length === 0 && (
            <p className="mensaje">
              No se encontraron templos con ese nombre.
            </p>
          )}

          <section className="grilla" aria-label="Templos budistas">
            {templosFiltrados.map((templo, indice) => (<TarjetaTemplo key={`${templo.id}-${indice}`} templo={templo}/>))}

</section>
        </>
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