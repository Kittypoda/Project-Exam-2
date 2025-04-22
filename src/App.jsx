import { Outlet } from 'react-router-dom';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
