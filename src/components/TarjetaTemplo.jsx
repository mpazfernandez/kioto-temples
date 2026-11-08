function TarjetaTemplo({ templo }) {
  return (
    <article className="tarjeta">
      <img
        src={templo.imagen}
        alt={templo.nombre}
      />

      <div className="contenido-tarjeta">
        <h2>{templo.nombre}</h2>
        <p>Zona: {templo.zona}</p>
        <p>Antigüedad: {templo.antiguedad} años</p>
        <p>Ubicación: Kyoto, Japón</p>
        <a
          href={templo.id}
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
