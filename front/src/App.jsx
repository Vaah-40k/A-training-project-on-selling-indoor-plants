import { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';
import '../src/assets/styles/App.css';

function App() {
  const [page, setPage] = useState('home');

  const go = (next) => {
    setPage(next);
    window.scrollTo(0, 0);
  };

  const headerProps = {
    onLoginClick: () => go('login'),
    onRegisterClick: () => go('register'),
    onCartClick: () => go('cart'),
    onAccountClick: () => go('account'),
    onAdminClick: () => go('admin'),
    onShopClick: () => go('catalog'),
    onHomeClick: () => go('home'),
  };

  return (
    <CartProvider>
      {page === 'home' && (
        <HomePage {...headerProps} onShopNow={() => go('catalog')} />
      )}

      {page === 'catalog' && (
        <CatalogPage
          {...headerProps}
          onBack={() => go('home')}
          onShopNow={() => go('catalog')}
        />
      )}

      {page === 'cart' && (
        <CartPage
          {...headerProps}
          onBack={() => go('home')}
          onShopNow={() => go('catalog')}
        />
      )}

      {page === 'account' && (
        <AccountPage {...headerProps} onBack={() => go('home')} />
      )}

      {page === 'admin' && (
        <AdminPage {...headerProps} onBack={() => go('home')} />
      )}

      {page === 'login' && (
        <LoginPage
          onBack={() => go('home')}
          onGoRegister={() => go('register')}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          onBack={() => go('home')}
          onGoLogin={() => go('login')}
        />
      )}
    </CartProvider>
  );
}

export default App;