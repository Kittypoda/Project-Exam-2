import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CreateVenueForm from '../components/CreateVenueForm';
import MyVenuesList from '../components/MyVenuesList';
import UpcomingBookings from '../components/UpcomingBookings';
import { API_KEY, BASE_URL } from '../utils/api';
import fallbackImage from '../assets/fallback.png';

export default function ManagerProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const venueListRef = useRef(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const userName = localStorage.getItem('userName');
  const accessToken = localStorage.getItem('accessToken');
  const isVenueManager = localStorage.getItem('isVenueManager') === 'true';

  const [activeSection, setActiveSection] = useState('createVenue');
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('avatarUrl') || '');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travelerBookings, setTravelerBookings] = useState([]);

  useEffect(() => {
    if (!isVenueManager) {
      setIsAuthorized(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/profile');
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}/holidaze/profiles/${userName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Noroff-API-Key': API_KEY,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch profile');

        setAvatarUrl(data.data.avatar?.url || '');
        setBio(data.data.bio || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    }

    fetchProfile();
  }, [userName, accessToken]);

  useEffect(() => {
    async function fetchTravelerBookings() {
      if (!userName || !accessToken) return;

      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/profiles/${userName}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Noroff-API-Key': API_KEY,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message || 'Failed to fetch bookings');
        }

        const sorted = data.data.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

        setTravelerBookings(sorted);
      } catch (err) {
        console.error('Traveler bookings fetch error:', err);
      }
    }

    fetchTravelerBookings();
  }, [userName, accessToken]);

  useEffect(() => {
    if (location.state?.scrollTo === 'venues') {
      setActiveSection('myVenues');
      setTimeout(() => {
        venueListRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, [location]);

  const handleSectionChange = (section) => setActiveSection(section);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const response = await fetch(`${BASE_URL}/holidaze/profiles/${userName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({
          bio,
          avatar: {
            url: avatarUrl,
            alt: `${userName}'s avatar`,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Update failed');

      localStorage.setItem('avatarUrl', data.data.avatar?.url || '');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Update error:', err);
      setStatus(err.message || 'Something went wrong');
    }
  };

  const groupedTravelerBookings = travelerBookings.reduce((acc, booking) => {
    const date = new Date(booking.dateFrom);
    const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(booking);
    return acc;
  }, {});

  return (
    <div className="md:grid md:grid-cols-3 max-w-6xl mx-auto min-h-screen pt-4 px-4">
      <aside className="bg-lightgray px-5 p-6 md:col-span-1">
        <div className="text-center pt-6">
          <img
            src={avatarUrl || 'https://placehold.co/150x150?text=Avatar'}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border"
          />
          <h2 className="text-lg font-semibold pt-2">
            {userName} <span className="font-normal">Venue Manager</span>
          </h2>
          <p className="text-sm py-4 text-gray-600">{bio || <span>No bio added yet.</span>}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm underline font-alexandria text-blackish mb-4"
          >
            Edit profile
          </button>
          <button
            onClick={() => handleSectionChange('createVenue')}
            className="btn btn-primary w-full mb-6"
          >
            Add a venue
          </button>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => handleSectionChange('myVenues')}
            className="block font-alexandria w-full md:text-left hover:underline"
          >
            My venues
          </button>
          <button
            onClick={() => handleSectionChange('bookings')}
            className="block w-full md:text-left font-alexandria hover:underline"
          >
            Upcoming bookings
          </button>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={() => handleSectionChange('travelerBookings')}
            className="block font-alexandria w-full md:text-left hover:underline"
          >
            My stays
          </button>
        </nav>
      </aside>

      <main className="md:col-span-2 md:p-6">
        {activeSection === 'createVenue' && <CreateVenueForm />}
        {activeSection === 'myVenues' && (
          <section ref={venueListRef}>
            <MyVenuesList />
          </section>
        )}
        {activeSection === 'bookings' && <UpcomingBookings />}
        {activeSection === 'travelerBookings' && (
          <>
            <h1 className="text-xl font-normal pb-10 pt-6">My stays</h1>
            {Object.keys(groupedTravelerBookings).length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              Object.entries(groupedTravelerBookings).map(([monthYear, group]) => (
                <div key={monthYear} className="mb-6">
                  <h2 className="text-md font-alexandria mb-2">{monthYear}</h2>
                  <div className="space-y-4">
                    {group.map((booking) => {
                      const venue = booking.venue;
                      const dateFrom = new Date(booking.dateFrom);
                      const dateTo = new Date(booking.dateTo);
                      const formatDate = (date) =>
                        `${date.getDate()}. ${date.toLocaleString('default', { month: 'short' })}`;

                      return (
                        <Link
                          to={`/venue/${venue.id}`}
                          key={booking.id}
                          className="flex gap-4 items-center transition"
                        >
                          <img
                            src={venue.media?.[0]?.url || fallbackImage}
                            alt={venue.media?.[0]?.alt || 'Venue image'}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-alexandria font-semibold">{venue.name}</p>
                            <p>
                              {formatDate(dateFrom)} - {formatDate(dateTo)}
                            </p>
                            <p>Guests: {booking.guests}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-xl w-full space-y-4 shadow-lg">
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="text-sm font-alexandria">
                Close
              </button>
            </div>

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-24 h-24 mx-auto rounded-full object-cover bg-lightgray text-lightgray"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-lightgray" />
            )}

            <form onSubmit={handleUpdate} className="space-y-4 px-20 pb-20">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="form-input"
                placeholder="New image link"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-input h-40"
                rows="3"
                placeholder="Write something about yourself..."
              />
              <button type="submit" className="btn btn-primary w-full">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
