import { caracteristicasTemplos } from '../data/caracteristicasTemplos.js';

export function filtrarPorIntereses(
  templos,
  intereses = []
) {
  return templos.filter((templo) => {
    const caracteristicas = caracteristicasTemplos[templo.id];

    if (!caracteristicas) return false;

    const categorias = [
      ...caracteristicas.jardines,
      ...caracteristicas.arquitectura
    ];

    if (categorias.length === 0) return false;

    if (intereses.length === 0) return true;

    return intereses.some((interes) =>
      categorias.includes(interes)
    );
  });
}

function calcularDistancia(temploA, temploB) {
  const radioTierra = 6371;

  const gradosARadianes = (grados) => grados * (Math.PI / 180);

  const latitudA = gradosARadianes(temploA.latitud);
  const latitudB = gradosARadianes(temploB.latitud);

  const diferenciaLatitud = gradosARadianes(
    temploB.latitud - temploA.latitud
  );

  const diferenciaLongitud = gradosARadianes(
    temploB.longitud - temploA.longitud
  );

  const a =
    Math.sin(diferenciaLatitud / 2) ** 2 +
    Math.cos(latitudA) *
    Math.cos(latitudB) *
    Math.sin(diferenciaLongitud / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radioTierra * c;
}

// Construye un recorrido de tres templos
function construirRecorrido(templos, puntoInicial) {
  const recorrido = [puntoInicial];
  const distancias = [];

  let disponibles = templos.filter(
    (templo) => templo.id !== puntoInicial.id
  );

  while (recorrido.length < 3) {
    const ultimoTemplo = recorrido[recorrido.length - 1];

    let temploMasCercano = null;
    let menorDistancia = Infinity;

    disponibles.forEach((templo) => {
      const distancia = calcularDistancia(ultimoTemplo, templo);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        temploMasCercano = templo;
      }
    });

    if (!temploMasCercano) break;

    distancias.push({
      desde: ultimoTemplo.nombre,
      hasta: temploMasCercano.nombre,
      kilometros: Number(menorDistancia.toFixed(2))
    });

    recorrido.push(temploMasCercano);

    disponibles = disponibles.filter(
      (templo) => templo.id !== temploMasCercano.id
    );
  }

  const distanciaTotal = distancias.reduce(
    (total, tramo) => total + tramo.kilometros,
    0
  );

  return {
    templos: recorrido,
    distancias,
    distanciaTotal: Number(distanciaTotal.toFixed(2))
  };
}

// Genera distintas alternativas de recorrido
export function generarRecorridos(templos, cantidad = 3) {
  if (!Array.isArray(templos) || templos.length < 3) {
    return [];
  }

  const puntosIniciales = [...templos].sort(
    () => Math.random() - 0.5
  );

  const recorridos = [];
  const combinaciones = new Set();

  for (const puntoInicial of puntosIniciales) {
    if (recorridos.length >= cantidad) break;

    const nuevoRecorrido = construirRecorrido(
      templos,
      puntoInicial
    );

    if (nuevoRecorrido.templos.length !== 3) continue;

    // Evitamos sugerir los mismos tres templos más de una vez
    const clave = nuevoRecorrido.templos
      .map((templo) => templo.id)
      .sort()
      .join('-');

    if (combinaciones.has(clave)) continue;

    combinaciones.add(clave);

    recorridos.push({
      id: `${puntoInicial.id}-${recorridos.length}`,
      nombre: `Recorrido sugerido ${recorridos.length + 1}`,
      templos: nuevoRecorrido.templos,
      distancias: nuevoRecorrido.distancias,
      distanciaTotal: nuevoRecorrido.distanciaTotal,
      zona: puntoInicial.zona
    });
  }

  return recorridos;
}
