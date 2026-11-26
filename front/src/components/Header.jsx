import '../assets/styles/Header.css';
import { useCart } from '../context/CartContext';
import { jwtDecoded } from '../utils/jwtDecoded';

const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#1e3a2b"/>
    <path d="M16 24c-4-3-6-7-6-11 3 0 6 2 6 6 0-4 3-6 6-6 0 4-2 8-6 11z" fill="#e8f0e5"/>
  </svg>`
)}`;

const cartIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`
)}`;

const Header = ({
  onLoginClick,
  onRegisterClick,
  onCartClick,
  onAccountClick,
  onAdminClick,
  onShopClick,
  onHomeClick,
}) => {
  const { totalCount } = useCart();
  const user = jwtDecoded();
  const isAuthorized = Boolean(user);

  const handleHome = (e) => {
    e.preventDefault();
    onHomeClick?.();
  };

  const handleShop = (e) => {
    e.preventDefault();
    onShopClick?.();
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#home" className="header__logo" onClick={handleHome}>
          <img src={logo} alt="GreenNest" />
          <span>GreenNest</span>
        </a>

        <nav className="header__nav">
          <a href="#home" onClick={handleHome}>Главная</a>
          <a href="#shop" onClick={handleShop}>Магазин</a>
          <a href="#about">О нас</a>
          <a href="#care">Уход за растениями</a>
          <a href="#blog">Блог</a>
        </nav>

        <div className="header__actions">
          {isAuthorized ? (
            <>
              <button className="btn btn--ghost" onClick={onAccountClick}>
                Кабинет
              </button>
              <button className="btn btn--ghost" onClick={onAdminClick}>
                Админ
              </button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={onLoginClick}>
                Вход
              </button>
              <button className="btn btn--dark" onClick={onRegisterClick}>
                Регистрация
              </button>
            </>
          )}

          <button
            className="header__cart"
            onClick={onCartClick}
            aria-label="Корзина"
          >
            <img src={cartIcon} alt="" />
            {totalCount > 0 && (
              <span className="header__cart-badge">{totalCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;