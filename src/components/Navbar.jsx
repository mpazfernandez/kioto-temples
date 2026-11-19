import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [hayScroll, setHayScroll] = useState(false);

  useEffect(() => {
    function detectarScroll() {
      setHayScroll(window.scrollY > 30);
    }

    detectarScroll();

    window.addEventListener('scroll', detectarScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', detectarScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar ${hayScroll ? 'navbar-scroll' : ''}`}
      aria-label="Navegación principal"
    >
      <NavLink to="/" className="logo">
        KIOTO TEMPLES
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/catalogo">
          CATÁLOGO
        </NavLink>

        <NavLink to="/mis-recorridos">
          MIS RECORRIDOS
        </NavLink>
      </div>
    </nav>
  );
}