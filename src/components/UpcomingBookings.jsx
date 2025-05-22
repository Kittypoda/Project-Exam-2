import { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../utils/api";

export default function UpcomingBookings() {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchManagerBookings() {
      try {
        const res = await fetch(`${BASE_URL}/holidaze/profiles/${userName}/venues?_bookings=true`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to fetch bookings");

        // flatten all bookings from all venues
        const allBookings = data.data.flatMap((venue) =>
          (venue.bookings || []).map((booking) => ({
            ...booking,
            venue,
          }))
        );

        const sorted = allBookings.sort(
          (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
        );

        setBookings(sorted);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchManagerBookings();
  }, [userName, accessToken]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!bookings.length) return <p>No bookings yet on your venues.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upcoming bookings</h2>
      {bookings.map((booking) => {
        const dateFrom = new Date(booking.dateFrom).toLocaleDateString();
        const dateTo = new Date(booking.dateTo).toLocaleDateString();
        return (
          <div key={booking.id} className="border p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <span className="font-semibold">{booking.venue.name}</span> in{" "}
              {booking.venue.location?.city || "Unknown location"}
            </p>
            <p className="text-sm">
              {dateFrom} – {dateTo}
            </p>
            <p className="text-sm">Guests: {booking.guests}</p>
          </div>
        );
      })}
    </div>
  );
}
