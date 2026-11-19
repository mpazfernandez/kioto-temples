export default function TarjetaInteres({
  tipo,
  seleccionado,
  onChange
}) {
  return (
    <label
      className={`tarjeta-interes ${
        seleccionado ? 'seleccionada' : ''
      }`}
    >
      <div className="interes-imagen">
        <img
          src={tipo.imagen}
          alt=""
        />

        <input
          type="checkbox"
          checked={seleccionado}
          onChange={() => onChange(tipo.id)}
        />
      </div>

      <span className="interes-nombre">
        {tipo.nombre}
      </span>
    </label>
  );
}