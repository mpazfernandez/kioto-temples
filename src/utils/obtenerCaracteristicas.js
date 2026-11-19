import { caracteristicasTemplos } from '../data/caracteristicasTemplos';

const nombresCaracteristicas = {
  jardin_seco: 'Jardín seco',
  jardin_musgo: 'Jardín de musgo',
  jardin_paisajistico: 'Jardín paisajístico',
  jardin_te: 'Jardín de té',
  arquitectura_zen: 'Arquitectura Zen',
  pagoda: 'Pagoda',
  salon_principal: 'Salón tradicional',
  puerta_sanmon: 'Puerta Sanmon'
};

export function obtenerNombresIntereses(intereses = []) {
  if (!Array.isArray(intereses)) return [];

  return intereses
    .map((interes) => nombresCaracteristicas[interes])
    .filter(Boolean);
}

export function obtenerCaracteristicas(idTemplo) {
  const caracteristicas = caracteristicasTemplos[idTemplo];

  if (!caracteristicas) return [];

  const categorias = [
    ...caracteristicas.jardines,
    ...caracteristicas.arquitectura
  ];

  return obtenerNombresIntereses(categorias);
}