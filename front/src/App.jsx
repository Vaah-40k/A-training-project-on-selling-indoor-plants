import { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import '../src/assets/styles/App.css';

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'login' | 'register' | 'catalog'

  const go = (next) => {
    setPage(next);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {page === 'home' && (
        <HomePage
          onLoginClick={() => go('login')}
          onRegisterClick={() => go('register')}
          onShopNow={() => go('catalog')}
        />
      )}
      {page === 'catalog' && (
        <CatalogPage
          onBack={() => go('home')}
          onLoginClick={() => go('login')}
          onRegisterClick={() => go('register')}
        />
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
    </>
  );
}

export default App;