import '../assets/styles/Categories.css';
import indoor from '../assets/img/5.jpg';
import outdoor from '../assets/img/4.jpg';
import succulents from '../assets/img/3.jpg';
import airpurifying from '../assets/img/2.jpg';
import care from '../assets/img/1.jpg';


const categories = [
  { img: indoor, name: 'Indoor Plants' },
  { img: outdoor, name: 'Outdoor Plants' },
  { img: succulents, name: 'Succulents' },
  { img: airpurifying, name: 'Air Purifying' },
  { img: care, name: 'Plant Care' },
];

const Categories = () => {
  return (
    <section className="categories" id="shop">
      <div className="container">
        <h2 className="section-title">Our Categories</h2>
        <div className="categories__grid">
          {categories.map((c) => (
            <a href="#shop" className="category" key={c.name}>
              <div className="category__img">
                <img src={c.img} alt={c.name} />
              </div>
              <span className="category__name">{c.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;