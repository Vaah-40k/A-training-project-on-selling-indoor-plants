import '../assets/styles/WhyChoose.css';
import centerPlant from '../assets/img/why-center.png';

const iconHealthy = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`
)}`;

const iconEco = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>`
)}`;

const iconReturns = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>`
)}`;

const iconSupport = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>`
)}`;

const features = [
  { icon: iconHealthy, title: 'Здоровые растения', text: 'Мы предлагаем самые здоровые растения для вашего пространства.' },
  { icon: iconEco, title: 'Экологичность', text: 'Экологичная и устойчивая упаковка.' },
  { icon: iconReturns, title: 'Простой возврат', text: 'Возврат и замена без лишних хлопот.' },
  { icon: iconSupport, title: 'Поддержка экспертов', text: 'Получите совет эксперта, когда вам это нужно.' },
];

const WhyChoose = () => {
  return (
    <section className="why" id="about">
      <div className="container">
        <h2 className="section-title">Почему выбирают GreenNest?</h2>
        <div className="why__grid">
          <div className="why__col">
            {features.slice(0, 2).map((f) => (
              <div className="feature" key={f.title}>
                <div className="feature__icon">
                  <img src={f.icon} alt="" />
                </div>
                <div>
                  <h3 className="feature__title">{f.title}</h3>
                  <p className="feature__text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="why__center">
            <img src={centerPlant} alt="Растение" />
          </div>

          <div className="why__col">
            {features.slice(2).map((f) => (
              <div className="feature" key={f.title}>
                <div className="feature__icon">
                  <img src={f.icon} alt="" />
                </div>
                <div>
                  <h3 className="feature__title">{f.title}</h3>
                  <p className="feature__text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;