import '../assets/styles/PlantCare.css';
import bannerBg from '../assets/img/photo_2026-11-19_13-05-32.jpg';

const iconWater = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>`
)}`;

const iconCare = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>`
)}`;

const PlantCare = () => {
  return (
    <section className="plant-care" id="care">
      <div className="container">
        <div className="plant-care__banner" style={{ backgroundImage: `url(${bannerBg})` }}>
          <div className="plant-care__content">
            <h2>Plant Care<br />Made Simple</h2>
            <p>Tips and guides to help your plants grow better.</p>
            <button className="btn btn--light">Explore Guides</button>
          </div>

          <div className="plant-care__cards">
            <div className="care-card">
              <img src={iconWater} alt="" />
              <h3>Watering Guide</h3>
              <p>Learn how much water your plants really need.</p>
            </div>
            <div className="care-card">
              <img src={iconCare} alt="" />
              <h3>Care Tips</h3>
              <p>Best tips for happy and healthy plants.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantCare;