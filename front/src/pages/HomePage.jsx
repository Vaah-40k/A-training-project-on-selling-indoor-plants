import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import WhyChoose from '../components/WhyChoose';
import PlantCare from '../components/PlantCare';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';

const HomePage = ({
  onLoginClick,
  onRegisterClick,
  onCartClick,
  onAccountClick,
  onAdminClick,
  onShopNow,
}) => {
  return (
    <div className="page">
      <Header
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onCartClick={onCartClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
      />

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