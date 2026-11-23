import '../assets/styles/Footer.css';

const iconShipping = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>`
)}`;

const iconPayment = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>`
)}`;

const iconSupport = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>`
)}`;

const iconFacebook = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>`
)}`;

const iconInstagram = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>`
)}`;

const iconPinterest = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.31-.09-.79-.17-2 .03-2.86.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.14-1.88 3.14-4.59 0-2.4-1.72-4.08-4.18-4.08-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.78.74 2.28.08.1.09.19.07.29-.08.32-.25.99-.28 1.13-.04.18-.14.22-.33.13-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.29-6.06 6.61-6.06 3.47 0 6.17 2.47 6.17 5.78 0 3.45-2.17 6.23-5.19 6.23-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.85 1.96-1.26 2.63.95.29 1.95.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>`
)}`;

const iconYoutube = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 .5 9.3.5 9.3.5s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
  </svg>`
)}`;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__advantages">
          <div className="advantage">
            <img src={iconShipping} alt="" />
            <div>
              <strong>Бесплатная доставка</strong>
              <span>На все заказы от $50</span>
            </div>
          </div>
          <div className="advantage">
            <img src={iconPayment} alt="" />
            <div>
              <strong>Безопасная оплата</strong>
              <span>100% безопасная оплата</span>
            </div>
          </div>
          <div className="advantage">
            <img src={iconSupport} alt="" />
            <div>
              <strong>Поддержка 24/7</strong>
              <span>Мы всегда готовы помочь</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 GreenNest. Все права защищены.</p>
          <div className="footer__social">
            <a href="#fb"><img src={iconFacebook} alt="Facebook" /></a>
            <a href="#ig"><img src={iconInstagram} alt="Instagram" /></a>
            <a href="#pin"><img src={iconPinterest} alt="Pinterest" /></a>
            <a href="#yt"><img src={iconYoutube} alt="YouTube" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;