import torii from '../assets/torii-gate-solid-black.svg';

export default function Footer() {
  function irArriba() {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }

  return (
    <footer className="footer">

      <div className="footer-interior">

        <div className="footer-identidad">

          <img
            src={torii}
            alt=""
            className="footer-logo"
          />

          <div>
            <p className="footer-marca">
              Kioto<br />
              Temples
            </p>

            <p className="footer-copy">
              © Kioto Temples All Rights Reserved 2026
            </p>
          </div>

        </div>

        <a
          href="#root"
          className="footer-arriba"
        >
          IR ARRIBA ↑
        </a>

      </div>

    </footer>
  );
}