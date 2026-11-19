import { useState } from 'react';
import { obtenerCaracteristicas } from '../utils/obtenerCaracteristicas';

export default function TarjetaRecorrido({
  recorrido,
  onGuardar,
  guardando,
  guardado
}) {
  const [desplegado, setDesplegado] = useState(false);

  return (
    <article className="tarjeta-recorrido">

      <button
        type="button"
        className="encabezado-recorrido"
        onClick={() => setDesplegado(!desplegado)}
        aria-expanded={desplegado}
      >
        <div>
          <p className="etiqueta">RECORRIDO SUGERIDO</p>
          <h3>{recorrido.nombre}</h3>

          <p>
            {recorrido.zona} · {recorrido.templos.length} templos
          </p>

          <p>
            Distancia estimada: {recorrido.distanciaTotal} km
          </p>
        </div>

        <span aria-hidden="true">
          {desplegado ? '−' : '+'}
        </span>
      </button>

      {desplegado && (
        <div className="contenido-recorrido">

          <p className="introduccion-recorrido">
            Este recorrido comienza en el primer templo y continúa
            con las paradas más cercanas.
          </p>

          <div className="lista-paradas">

            {recorrido.templos.map((templo, indice) => {
              const caracteristicas = obtenerCaracteristicas(templo.id);

              return (
                <div key={templo.id}>

                  <div className="parada-recorrido">

                    <span className="numero-parada">
                      {indice + 1}
                    </span>

                    <img
                      src={templo.imagen}
                      alt={templo.nombre}
                      className="imagen-parada"
                      loading="lazy"
                    />

                    <div className="datos-parada">
                      <h4>{templo.nombre}</h4>
                      <p>{templo.zona}</p>

                      {templo.antiguedad != null && (
                        <p>
                          Antigüedad aproximada: {templo.antiguedad} años
                        </p>
                      )}

                      {caracteristicas.length > 0 && (
                        <ul className="caracteristicas-parada">
                          {caracteristicas.map((caracteristica) => (
                            <li key={caracteristica}>
                              {caracteristica}
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>

                  </div>

                  {indice < recorrido.templos.length - 1 && (
                    <div className="distancia-paradas">
                      ↓
                      <span>
                        {recorrido.distancias[indice]?.kilometros} km
                        estimados hasta la siguiente parada
                      </span>
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          <div className="resumen-recorrido">
            <p>
              Distancia total estimada:{' '}
              <strong>{recorrido.distanciaTotal} km</strong>
            </p>

            <button
              type="button"
              onClick={() => onGuardar(recorrido)}
              disabled={guardando || guardado}
            >
              {guardado
                ? 'Recorrido guardado'
                : guardando
                  ? 'Guardando...'
                  : 'Guardar recorrido'}
            </button>
          </div>

        </div>
      )}

    </article>
  );
}