import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './config';

// 1. Guardar un recorrido nuevo
export async function guardarRecorrido(recorrido, userId) {
  if (!recorrido.nombre?.trim()) {
    throw new Error('El recorrido necesita un nombre.');
  }

  if (!Array.isArray(recorrido.templos) || recorrido.templos.length !== 3) {
    throw new Error('El recorrido debe contener exactamente tres templos.');
  }

  const nuevoRecorrido = {
    nombre: recorrido.nombre.trim(),
    zona: recorrido.zona,
    templos: recorrido.templos,
    userId,
    creado: serverTimestamp()
  };

  const referencia = await addDoc(
    collection(db, 'recorridos'),
    nuevoRecorrido
  );

  return referencia.id;
}

// 2. Obtener los recorridos del usuario actual
export async function obtenerRecorridos(userId) {
  const referencia = collection(db, 'recorridos');

  const consulta = query(
    referencia,
    where('userId', '==', userId)
  );

  const resultado = await getDocs(consulta);

  return resultado.docs.map((documento) => ({
    id: documento.id,
    ...documento.data()
  }));
}

// 3. Modificar un recorrido
export async function actualizarRecorrido(id, cambios, userId) {
  const referencia = doc(db, 'recorridos', id);

  await updateDoc(referencia, {
    ...cambios,
    userId
  });
}

// 4. Eliminar un recorrido
export async function eliminarRecorrido(id) {
  const referencia = doc(db, 'recorridos', id);

  await deleteDoc(referencia);
}