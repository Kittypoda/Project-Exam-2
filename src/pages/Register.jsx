import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import registerImg from '../assets/poolwoman.png';

const API_URL = 'https://v2.api.noroff.dev';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || 'Registration failed');
      }

      navigate('/login');
      localStorage.removeItem('isVenueManager');
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
      <div className="flex justify-center px-8 py-40">
        <div className="w-full max-w-md flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <h1 className="font-alexandria font-semibold p-2 text-center">Sign up as a traveler</h1>
            <h2 className="text-center p-2">
              Already a user?{' '}
              <Link to="/login" className="underline text-underline">
                Log in here
              </Link>
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input my-4"
            />
            <input
              type="email"
              name="email"
              placeholder="example@stud.noroff.no"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input my-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input my-4"
            />

            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>

          <div className="mt-10 w-full">
            <div className="font-alexandria font-light">
              Turn your special spot into someone’s stay
            </div>
            <Link
              to="/managerregister"
              className="text-center btn btn-secondary mt-4 w-full inline-block"
            >
              Become a venue manager
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden px-6 pb-40 lg:block">
        <img
          src={registerImg}
          alt="Registration"
          className="w-full max-h-[900px] min-h-[800px] object-cover rounded-2xl rounded-tr-none"
        />
      </div>
    </div>
  );
}
