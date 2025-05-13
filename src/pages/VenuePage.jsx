
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VenuePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
        if (!response.ok) {
          throw new Error("Venue not found");
        }
        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <div className="text-center mt-12">Laster...</div>;
  if (error) return <div className="text-center text-red-500 mt-12">Feil: {error}</div>;
  if (!venue) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>

      {venue.media?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {venue.media.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt || `Bilde ${index + 1}`}
              className="rounded-xl w-full h-64 object-cover"
            />
          ))}
        </div>
      )}

      <p className="mb-2 text-blackish">{venue.description}</p>
      <p className="mb-1">
        <strong>Price:</strong> {venue.price} NOK/night
      </p>
      <p className="mb-1">
        <strong>Guests:</strong> {venue.maxGuests}
      </p>
      <p className="mb-4">
        <strong>Location:</strong> {venue.location.address}, {venue.location.city}, {venue.location.country}
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Fasiliteter</h2>
        <ul className="list-disc list-inside">
          {venue.meta.wifi && <li>Wi-Fi</li>}
          {venue.meta.parking && <li>Parkering</li>}
          {venue.meta.breakfast && <li>Frokost</li>}
          {venue.meta.pets && <li>Husdyr tillatt</li>}
        </ul>
      </div>
    </div>
  );
}
