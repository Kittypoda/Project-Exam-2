import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main className="px-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
