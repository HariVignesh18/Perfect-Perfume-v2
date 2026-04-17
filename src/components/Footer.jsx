export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="navcon" className="footer">
      <div className="footer-content">
        <span className="copyright">
          © {year} Perfect Perfume
        </span>

        <span className="separator">|</span>

        <ul className="social-icons">
          <li>
            <a
              href="https://www.linkedin.com/in/hari-vignesh-b-c/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </li>

          <li>
            <a
              href="https://github.com/HariVignesh18"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i>
            </a>
          </li>

          <li>
            <a
              href="https://www.instagram.com/harivignesh18"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}