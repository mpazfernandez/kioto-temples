import { useState } from 'react';

import {
  generarRecorridos,
  filtrarPorIntereses
} from '../utils/generarRecorridos';

import TarjetaRecorrido from './TarjetaRecorrido';
import { guardarRecorrido } from '../firebase/recorridosService';
import TarjetaInteres from './TarjetaInteres';

const tiposJardines = [
  {
    id: 'jardin_seco',
    nombre: 'Jardín seco',
    imagen: '/images/intereses/jardin-seco.jpg'
  },
  {
    id: 'jardin_musgo',
    nombre: 'Jardín de musgo',
    imagen: '/images/intereses/jardin-musgo.jpg'
  },
  {
    id: 'jardin_paisajistico',
    nombre: 'Jardín paisajístico',
    imagen: '/images/intereses/jardin-paisajistico.jpg'
  },
  {
    id: 'jardin_te',
    nombre: 'Jardín de té',
    imagen: '/images/intereses/jardin-te.jpg'
  }
];

const tiposArquitectura = [
  {
    id: 'arquitectura_zen',
    nombre: 'Arquitectura Zen',
    imagen: '/images/intereses/arquitectura-zen.jpg'
  },
  {
    id: 'pagoda',
    nombre: 'Pagodas',
    imagen: '/images/intereses/pagoda.jpg'
  },
  {
    id: 'salon_principal',
    nombre: 'Salones tradicionales',
    imagen: '/images/intereses/salon-principal.jpg'
  },
  {
    id: 'puerta_sanmon',
    nombre: 'Puertas Sanmon',
    imagen: '/images/intereses/puerta-sanmon.jpg'
  }
];

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
    // Primero filtramos por zona
    const templosPorZona = templos.filter((templo) => {
      return zona === 'Todas' || templo.zona === zona;
    });

    // Después filtramos por intereses
    const templosDisponibles = filtrarPorIntereses(
      templosPorZona,
      intereses
    );

    setRecorridosGuardados([]);

    if (templosDisponibles.length < 3) {
      setRecorridos([]);
      setMensaje(
        'No hay suficientes templos que coincidan con tu selección. Probá ampliando la zona o modificando tus intereses.'
      );
      return;
    }

    const sugerencias = generarRecorridos(
      templosDisponibles,
      3
    ).map((recorrido) => ({
      ...recorrido,
      intereses: [...intereses]
    }));

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
        <p className="etiqueta">DESCUBRÍ KIOTO</p>
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
              <option
                key={zonaDisponible}
                value={zonaDisponible}
              >
                {zonaDisponible}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="campo campo-intereses">
          <legend>
            ¿Qué tipos de jardines te gustaría descubrir?
          </legend>

          <div className="grilla-intereses">
            {tiposJardines.map((tipo) => (
              <TarjetaInteres
                key={tipo.id}
                tipo={tipo}
                seleccionado={intereses.includes(tipo.id)}
                onChange={cambiarInteres}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="campo campo-intereses">
          <legend>
            ¿Qué tipos de arquitectura te interesan?
          </legend>

          <div className="grilla-intereses">
            {tiposArquitectura.map((tipo) => (
              <TarjetaInteres
                key={tipo.id}
                tipo={tipo}
                seleccionado={intereses.includes(tipo.id)}
                onChange={cambiarInteres}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={handleGenerarRecorridos}
          disabled={guardandoId !== null}
        >
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