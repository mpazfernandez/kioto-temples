
function TarjetaTemplo({ templo }) {
  // Construimos el enlace a partir del identificador de Wikidata
  const idWikidata = templo.id.split('/').pop();
  const enlaceWikidata = `https://www.wikidata.org/wiki/${idWikidata}`;

  return (
    <article className="tarjeta">
      <img
        src={templo.imagen}
        alt={templo.nombre}
        loading="lazy"
      />

      <div className="contenido-tarjeta">
        <h2>{templo.nombre}</h2>

        <p>Zona: {templo.zona}</p>

        <p>
          Antigüedad aproximada: {templo.antiguedad} años
        </p>

        <small className="aclaracion-antiguedad">
          Estimación basada en el año de fundación registrado.
          No necesariamente representa la antigüedad del edificio actual.
        </small>

        <p>Ubicación: Kyoto, Japón</p>

        <a
          href={enlaceWikidata}
          target="_blank"
          rel="noreferrer"
        >
          Consultar en Wikidata
        </a>
      </div>
    </article>
  );
}

export default TarjetaTemplo;
