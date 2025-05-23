import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/managerregister"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
