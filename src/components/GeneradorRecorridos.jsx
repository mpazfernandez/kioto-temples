import { useState } from 'react';
import { generarRecorridos } from '../utils/generarRecorridos';
import TarjetaRecorrido from './TarjetaRecorrido';
import { guardarRecorrido } from '../firebase/recorridosService';

export default function GeneradorRecorridos({ templos, userId }) {
  const [zona, setZona] = useState('Todas');
  const [intereses, setIntereses] = useState([]);
  const [recorridos, setRecorridos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [recorridosGuardados, setRecorridosGuardados] = useState([]);
  const [guardandoId, setGuardandoId] = useState(null);

  // Obtenemos las zonas disponibles
  const zonas = [
    ...new Set(templos.map((templo) => templo.zona))
  ].sort((a, b) => a.localeCompare(b));

  // Activar o desactivar intereses
  function cambiarInteres(interes) {
    setIntereses((actuales) =>
      actuales.includes(interes)
        ? actuales.filter((item) => item !== interes)
        : [...actuales, interes]
    );
  }

  // Generar recorridos
  function handleGenerarRecorridos() {
    const templosDisponibles = templos.filter((templo) => {
      return zona === 'Todas' || templo.zona === zona;
    });

    if (templosDisponibles.length < 3) {
      setRecorridos([]);
      setMensaje('Esta zona no tiene suficientes templos para generar un recorrido.');
      return;
    }

    const sugerencias = generarRecorridos(templosDisponibles, 3);

    setRecorridos(sugerencias);

    setMensaje(
      sugerencias.length > 0
        ? `${sugerencias.length} recorridos encontrados.`
        : 'No se pudieron generar recorridos diferentes.'
    );
  }

  // Guardar recorrido
  async function handleGuardarRecorrido(recorrido) {
    if (!userId) {
      setMensaje('No se pudo identificar al usuario.');
      return;
    }

    setGuardandoId(recorrido.id);
    setMensaje('');

    try {
      await guardarRecorrido(recorrido, userId);

      setRecorridosGuardados((actuales) => [
        ...actuales,
        recorrido.id
      ]);

      setMensaje('¡El recorrido se guardó correctamente!');

    } catch (error) {
      console.error('Error al guardar el recorrido:', error);
      setMensaje('No se pudo guardar el recorrido. Intentá nuevamente.');

    } finally {
      setGuardandoId(null);
    }
  }

  return (
    <section className="generador">

      <div className="generador-intro">
        <p className="etiqueta">DISCOVER KYOTO</p>
        <h2>Creá tu recorrido</h2>
        <p>
          Explorá templos budistas y descubrí nuevos lugares
          a través de recorridos organizados por cercanía.
        </p>
      </div>

      <div className="formulario-recorrido">

        <div className="campo">
          <label htmlFor="zona-recorrido">
            ¿Qué zona querés explorar?
          </label>

          <select
            id="zona-recorrido"
            value={zona}
            onChange={(evento) => setZona(evento.target.value)}
          >
            <option value="Todas">Todas las zonas</option>

            {zonas.map((zonaDisponible) => (
              <option key={zonaDisponible} value={zonaDisponible}>
                {zonaDisponible}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="campo">
          <legend>¿Qué te interesa descubrir?</legend>

          <label>
            <input
              type="checkbox"
              checked={intereses.includes('jardines')}
              onChange={() => cambiarInteres('jardines')}
            />
            Jardines
          </label>

          <label>
            <input
              type="checkbox"
              checked={intereses.includes('arquitectura')}
              onChange={() => cambiarInteres('arquitectura')}
            />
            Arquitectura
          </label>

          <small>
            Las preferencias estarán disponibles cuando completemos
            la clasificación de los templos.
          </small>
        </fieldset>

        <button type="button" onClick={handleGenerarRecorridos}>
          Generar recorridos
        </button>

      </div>

      {mensaje && (
        <p className="mensaje" role="status">
          {mensaje}
        </p>
      )}

      {recorridos.length > 0 && (
        <div className="resultados-recorridos">
          <h3>Recorridos sugeridos</h3>

          <p>
            Seleccioná un recorrido para descubrir sus templos.
          </p>

          {/* Las tarjetas se incorporarán en el siguiente paso */}
          {recorridos.map((recorrido) => (
            <TarjetaRecorrido
              key={recorrido.id}
              recorrido={recorrido}
              onGuardar={handleGuardarRecorrido}
              guardando={guardandoId === recorrido.id}
              guardado={recorridosGuardados.includes(recorrido.id)}
            />
          ))}
        </div>
      )}

    </section>
  );
}
