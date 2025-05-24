import { useEffect, useState } from 'react';
import { API_KEY, BASE_URL } from '../utils/api';
import fallbackImage from '../assets/fallback.png';

export default function UpcomingBookings() {
  const userName = localStorage.getItem('userName');
  const accessToken = localStorage.getItem('accessToken');
  const [groupedBookings, setGroupedBookings] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchManagerBookings() {
      try {
        const res = await fetch(
          `${BASE_URL}/holidaze/profiles/${userName}/venues?_bookings=true&_customer=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Noroff-API-Key': API_KEY,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch bookings');

        const allBookings = data.data.flatMap((venue) =>
          (venue.bookings || []).map((booking) => ({
            ...booking,
            venue,
          }))
        );

        const sorted = allBookings.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

        const grouped = {};
        sorted.forEach((booking) => {
          const date = new Date(booking.dateFrom);
          const key = date.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          });

          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(booking);
        });

        setGroupedBookings(grouped);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchManagerBookings();
  }, [userName, accessToken]);

  if (error) return <p>{error}</p>;
  if (!Object.keys(groupedBookings).length) return <p>No bookings yet on your venues.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-normal pt-6">Upcoming bookings</h1>

      {Object.entries(groupedBookings).map(([monthYear, bookings]) => (
        <div key={monthYear}>
          <h2 className="text-md font-alexandria mt-6">{monthYear}</h2>

          <div className="space-y-4 mt-2">
            {bookings.map((booking) => {
              const dateFrom = new Date(booking.dateFrom).toLocaleDateString('no-NO', {
                day: 'numeric',
                month: 'long',
              });
              const dateTo = new Date(booking.dateTo).toLocaleDateString('no-NO', {
                day: 'numeric',
                month: 'long',
              });

              return (
                <div key={booking.id} className="flex gap-4 items-start">
                  <img
                    src={booking.venue.media?.[0]?.url || fallbackImage}
                    alt={booking.venue.media?.[0]?.alt || 'Venue image'}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{booking.venue.name}</p>
                    <p>{booking.customer?.name || 'Unknown guest'}</p>
                    <p>
                      {dateFrom} - {dateTo}
                    </p>
                    <p>Guests: {booking.guests}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
