import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("accessToken");
  const avatarUrl = localStorage.getItem("avatarUrl");
  const userName = localStorage.getItem("userName");
  const isVenueManager = localStorage.getItem("isVenueManager") === "true";
  const isOnProfilePage = location.pathname === "/profile";
  const isOnManagerProfile = location.pathname === "/managerprofile";

  const isAuthPage = ["/login", "/register", "/managerregister"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("isVenueManager");
    navigate("/login");
  };

  return (
    <header className="bg-white px-4 pt-4 pb-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-logo">
          Holidaze
        </Link>

        {!isAuthPage && (
          <nav className="hidden md:flex gap-4 items-center">
            {!isLoggedIn && (
              <>
                <Link to="/register" className="text-base font-alexandria pt-2 font-medium">Register</Link>
                <Link to="/login" className="btn btn-primary">Login</Link>
              </>
            )}

            {isLoggedIn && !isOnProfilePage && !isOnManagerProfile && (
              <Link to={isVenueManager ? "/managerprofile" : "/profile"}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-lightgray text-lightgray" />
                )}
              </Link>
            )}

            {isLoggedIn && (isOnProfilePage || isOnManagerProfile) && (
              <button onClick={handleLogout} className="btn btn-secondary">
                Log out
              </button>
            )}

            <Link
              to={isVenueManager ? "/register" : "/managerregister"}
              className="btn btn-secondary"
            >
              {isVenueManager ? "Traveler" : "Venue Manager"}
            </Link>
          </nav>
        )}

        {!isAuthPage && (
          <button
            className="md:hidden btn btn-primary"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        )}
      </div>

      {/* Menu modal */}
      {!isAuthPage && menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center p-6">
          <button
            className="self-end text-sm font-alexandria mb-8"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>

          <div className="flex flex-col items-center p-6">
            {!isLoggedIn && (
              <>
                <Link
                  to="/register"
                  className="text-md mb-4 font-alexandria"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary w-full text-center mb-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}

            {isLoggedIn && !isOnProfilePage && !isOnManagerProfile && (
              <>
                <Link
                  to={isVenueManager ? "/managerprofile" : "/profile"}
                  onClick={() => setMenuOpen(false)}
                  className="mb-2"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-lightgray text-lightgray" />
                  )}
                </Link>
                <p className="text-md font-medium mb-4">{userName}</p>
              </>
            )}

            <Link
              to={isVenueManager ? "/register" : "/managerregister"}
              className="btn btn-secondary w-full text-center mb-4"
              onClick={() => setMenuOpen(false)}
            >
              {isVenueManager ? "Traveler" : "Venue Manager"}
            </Link>

            {isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="btn btn-secondary w-full text-center"
              >
                Log out
              </button>
            )}
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





