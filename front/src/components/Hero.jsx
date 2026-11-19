import '../assets/styles/Hero.css';
import heroBg from '../assets/img/photo_2026-11-19_13-05-57.jpg';

const iconCustomers = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`
)}`;

const iconPlants = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>`
)}`;

const iconVarieties = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2v8"/>
    <path d="M6 6c0 4 3 6 6 6s6-2 6-6"/>
    <path d="M4 22h16"/>
    <path d="M12 14v8"/>
  </svg>`
)}`;

const iconRating = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`
)}`;

const stats = [
  { icon: iconCustomers, value: '1,000+', label: 'Happy Customers' },
  { icon: iconPlants, value: '4,500+', label: 'Plants Sold' },
  { icon: iconVarieties, value: '520+', label: 'Plant Varieties' },
  { icon: iconRating, value: '4.8★', label: 'Customer Rating' },
];

const Hero = ({ onShopNow }) => {
  return (
    <section
      className="hero"
      id="home"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            Bring Nature<br />Into Your Home
          </h1>
          <p className="hero__text">
            Beautiful indoor plants that purify air and make your space livelier.
          </p>
          <div className="hero__buttons">
            <button className="btn btn--dark" onClick={onShopNow}>
              Shop Now
            </button>
            <button className="btn btn--ghost">
              <span className="hero__play">▶</span> Watch Video
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero__stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <img src={s.icon} alt="" className="stat__icon" />
              <div className="stat__value">{s.value}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;