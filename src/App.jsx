import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <nav className="bg-gray-100 p-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/avenue">Avenue</Link>
      </nav>

      {/* Her vises innholdet fra Home/Login/Register osv. */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
