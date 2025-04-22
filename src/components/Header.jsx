import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-logo">
          Holidaze
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4">
          <Link to="/register" className="text-base pt-2 font-medium">Register</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/managerlogin" className="btn btn-secondary">Venue Manager</Link>
        </nav>


        {/* Mobile menu button */}
        <button
          className="md:hidden btn btn-primary"
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </div>

      {/* Mobile full screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center p-6">
          <button
            className="self-end text-md font-alexandria mb-8"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <div className='flex flex-col items-center p-6'>
          <Link to="/register" className="text-md mb-4 font-alexandria" onClick={() => setMenuOpen(false)}>
            Register
          </Link>

          <Link to="/login" className="btn btn-primary w-full text-center mb-4" onClick={() => setMenuOpen(false)}>
            Login
          </Link>

          <Link to="/managerlogin" className="btn btn-secondary w-full text-center mb-4" onClick={() => setMenuOpen(false)}>
            Venue Manager
          </Link> 
          </div>  
          <div className="absolute bottom-4 left-6 text-left">
            <div className="font-logo text-2xl">Holidaze</div>
            <p className="text-sm font-extralight">A bed for every adventure</p>
            <p className="text-sm font-extralight">© 2025 Holidaze. All rights reserved</p>
          </div>
        </div>
      )}
    </header>
  );
}
