import { useEffect, useState } from 'react';
import { API_KEY, BASE_URL } from '../utils/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalShell from './ModalShell';
import EditVenueModal from './EditVenueModal';
import fallbackImage from '../assets/fallback.png';

export default function MyVenuesList() {
  const userName = localStorage.getItem('userName');
  const accessToken = localStorage.getItem('accessToken');
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/holidaze/profiles/${userName}/venues?_bookings=true`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venues');

      setVenues(data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(id) {
    setSelectedVenue(id);
    setShowDeleteModal(true);
  }

  function handleEditClick(venue) {
    setSelectedVenue(venue);
    setShowEditModal(true);
  }

  async function confirmDelete() {
    try {
      const res = await fetch(`${BASE_URL}/holidaze/venues/${selectedVenue}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || 'Failed to delete venue');
      }

      setVenues((prev) => prev.filter((venue) => venue.id !== selectedVenue));
      setShowDeleteModal(false);
      setSelectedVenue(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>{error}</p>;
  if (!venues.length) return <p>You have not created any venues yet.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-normal pt-6">My Venues</h1>

      {venues.map((venue) => (
        <div
          key={venue.id}
          className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-gray-200"
        >
          <Link to={`/venue/${venue.id}`} className="flex items-center gap-4 flex-1">
            <img
              src={venue.media?.[0]?.url || fallbackImage}
              alt={venue.media?.[0]?.alt || 'Venue image'}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div>
              <h2 className="font-normal">{venue.name}</h2>
              <p>{venue.location?.city || 'Unknown location'}</p>
              <p>{venue._count?.bookings || 0} bookings</p>
            </div>
          </Link>

          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-10">
            <button onClick={() => handleEditClick(venue)} className="btn btn-primary">
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(venue.id)}
              className="text-sm font-alexandria text-blackish hover:underline flex items-center gap-1"
            >
              Delete venue
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}

      {showDeleteModal && (
        <ModalShell onClose={() => setShowDeleteModal(false)}>
          <div className="text-center space-y-4 p-6 px-9">
            <h1 className="text-xl font-medium pt-6">Delete venue</h1>
            <p className="text-sm font-extralight">Are you sure you want to delete this venue?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={confirmDelete} className="btn bg-deletered w-full">
                Delete venue
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-primary w-full">
                Cancel
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {showEditModal && selectedVenue && (
        <EditVenueModal
          venue={selectedVenue}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchVenues}
        />
      )}
    </div>
  );
}
