import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TarjetaTemplo from '../components/TarjetaTemplo';
import GeneradorRecorridos from '../components/GeneradorRecorridos';

export default function Inicio({ templos, userId }) {
  const templosDestacados = templos.slice(0, 3);

  return (
    <>
      <div className="seccion-oscura">
        <Navbar />

        <header className="hero">
          <div className="hero-contenido">
            <p className="etiqueta">UNA EXPLORACIÓN DE KIOTO</p>

            <h1>ENTRE ARQUITECTURA Y CONTEMPLACIÓN</h1>

            <p>
              Un recorrido por los templos budistas de Kioto,
              sus espacios y su historia.
            </p>
          </div>

          <div className="hero-imagen">
            {templosDestacados[0] && (
              <img
                src={templosDestacados[0].imagen}
                alt={templosDestacados[0].nombre}
              />
            )}
          </div>
        </header>
      </div>

      <main>
        <section className="seccion-catalogo">
          <div className="encabezado-seccion">
            <div>
              <p className="etiqueta">CATÁLOGO</p>
              <h2>TEMPLOS PARA DESCUBRIR</h2>
            </div>

            <Link to="/catalogo" className="enlace-seccion">
              VER TODOS
            </Link>
          </div>

          <div className="grilla">
            {templosDestacados.map((templo) => (
              <TarjetaTemplo
                key={templo.id}
                templo={templo}
              />
            ))}
          </div>
        </section>

        <GeneradorRecorridos
          templos={templos}
          userId={userId}
        />
      </main>

      <Footer />
    </>
  );
}