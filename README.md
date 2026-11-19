# Kioto Temples

Aplicación web para explorar templos budistas de Kioto, Japón, y generar recorridos personalizados según zonas, intereses arquitectónicos y paisajísticos, y cercanía geográfica.

Proyecto desarrollado para el Trabajo Práctico 2 de Desarrollo Frontend II (2026).

## Aplicación publicada

[Acceder a Kioto Temples](https://kioto-temples.vercel.app/)

## Funcionalidades

- Consulta de un catálogo de 203 templos budistas.
- Exploración y filtrado de templos por zona.
- Generación de recorridos de tres templos según zona, intereses y proximidad.
- Guardado, consulta, edición del nombre y descripción, y eliminación de recorridos personales.
- Persistencia en Cloud Firestore e identificación mediante autenticación anónima.
- Interfaz adaptable a computadoras y dispositivos móviles.

## Tecnologías

- React y Vite: interfaz y entorno de desarrollo.
- React Router DOM: navegación.
- Firebase Authentication y Cloud Firestore: autenticación y persistencia.
- Lenis: desplazamiento suave.
- CSS: estilos, adaptación responsive y animaciones.
- GitHub y Vercel: control de versiones y despliegue.

## Instalación y ejecución

Se requiere Node.js compatible con la versión de Vite del proyecto y npm.

1. Clonar o descargar este repositorio y abrir una terminal en la carpeta que contiene `package.json`.
2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz tomando `.env.example` como referencia y completar las variables de Firebase.
4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

Abrir la dirección indicada en la terminal.

## Configuración de Firebase

Para utilizar un proyecto de Firebase propio:

1. Crear un proyecto en Firebase Console y registrar una aplicación web.
2. Habilitar el proveedor de autenticación anónima en Firebase Authentication.
3. Crear una base de datos Cloud Firestore.
4. Completar el archivo `.env` con la configuración de la aplicación web:

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```

5. Cargar los registros del catálogo, disponibles en `src/data/templos.json`, en la colección `templos` mediante la consola o un procedimiento administrativo de importación. Conservar los campos de cada templo. La aplicación no importa automáticamente estos datos.
6. Publicar las reglas incluidas en `firestore.rules` desde Firebase Console.

La conexión se inicializa en `src/firebase/config.js` mediante `import.meta.env`. El archivo `.env` no se incluye en el repositorio. Las variables `VITE_` son visibles en el cliente; no deben contener credenciales privadas.

### Organización de los datos

| Colección | Contenido | Acceso |
| --- | --- | --- |
| `templos` | Nombre, zona, imagen, antigüedad, identificador y coordenadas de cada templo. | Lectura para usuarios autenticados; escritura denegada desde el cliente. |
| `recorridos` | Nombre, descripción, zona, templos seleccionados, intereses y datos de identificación del propietario. | Creación autenticada y consulta, modificación y eliminación de registros propios. |

Las operaciones CRUD de recorridos se encuentran en `src/firebase/recorridosService.js`. La autenticación anónima permite conservar los recorridos al recargar la aplicación en el mismo navegador, mientras se mantenga su identidad. No sincroniza automáticamente los recorridos entre dispositivos distintos.

## Organización del código

```text
src/
├── assets/       Recursos gráficos
├── components/   Componentes reutilizables
├── data/         Catálogo y clasificación de templos
├── firebase/     Configuración y operaciones de Firestore
├── pages/        Vistas de la aplicación
├── utils/        Filtrado y generación de recorridos
├── App.jsx       Rutas y carga de datos
├── main.jsx      Punto de entrada
└── styles.css    Estilos generales
public/           Recursos públicos
```

## Origen y procesamiento de los datos

El catálogo se construyó a partir de información obtenida de Wikidata y posteriormente almacenada en Cloud Firestore. Los datos de arquitectura y jardines se complementan mediante una clasificación local en `src/data/caracteristicasTemplos.js`.

Los recorridos se generan en función de los filtros seleccionados y las distancias geográficas calculadas a partir de las coordenadas de los templos. Las distancias son estimaciones en línea recta, no distancias peatonales ni indicaciones de navegación.

## Compilación y despliegue

Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

Para desplegar en Vercel, importar el repositorio, seleccionar Vite, utilizar `npm run build` como comando de compilación y `dist` como directorio de salida. Configurar las cuatro variables de Firebase en el entorno de producción y realizar el despliegue.

El archivo `vercel.json` permite resolver las rutas de React Router al acceder directamente a ellas o recargar una página interna. Las reglas de Firestore se publican por separado en Firebase Console.
