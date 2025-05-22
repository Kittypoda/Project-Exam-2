import { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../utils/api";
import { Link } from "react-router-dom";

export default function MyVenuesList() {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`${BASE_URL}/holidaze/profiles/${userName}/venues?_bookings=true`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to fetch venues");

        setVenues(data.data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchVenues();
  }, [userName, accessToken]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!venues.length) return <p>You have not created any venues yet.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Venues</h2>
      {venues.map((venue) => (
        <Link
          to={`/venue/${venue.id}`}
          key={venue.id}
          className="flex items-center gap-4 border p-4 rounded-lg hover:shadow"
        >
          <img
            src={venue.media?.[0]?.url || "https://placehold.co/100x100"}
            alt={venue.media?.[0]?.alt || "Venue image"}
            className="w-24 h-24 rounded object-cover"
          />
          <div>
            <h3 className="font-semibold">{venue.name}</h3>
            <p className="text-sm text-gray-600">{venue.location?.city || "Unknown location"}</p>
            <p className="text-sm">{venue._count?.bookings || 0} bookings</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
