import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import WhyChoose from '../components/WhyChoose';
import PlantCare from '../components/PlantCare';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';

const HomePage = ({ onShopNow, ...headerProps }) => {
  return (
    <div className="page">
      <Header {...headerProps} />
      <main>
        <Hero onShopNow={onShopNow} />
        <Categories />
        <WhyChoose />
        <PlantCare />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;