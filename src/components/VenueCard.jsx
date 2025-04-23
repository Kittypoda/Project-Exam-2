import fallbackImage from '../assets/fallback.png'; // tilpass navnet til ditt bilde

export default function VenueCard({ venue }) {
  console.log("Media for venue:", venue.name, venue.media);

  const hasMedia = Array.isArray(venue.media) && venue.media.length > 0;
  const image = hasMedia ? venue.media[0] : null; // Endret fra media[0].url til media[0]
  const alt = venue.name;
  const location = venue.location?.city || venue.location?.country || "Unknown";

  console.log("VENUE:", venue.name);
  console.log("MEDIA:", venue.media);
  console.log("IMAGE URL:", image);

  return (
    <div>
      {image ? (
        <img
          src={image}
          alt={alt}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      ) : (
        <img
  src={fallbackImage}
  alt="Fallback image"
  className="w-full h-64 object-cover rounded-xl mb-4"
/>
      )}
      <div className="font-alexandria text-black text-lg">
        {venue.name}, {location}
      </div>
      <p className="text-sm font-extralight mt-auto">
        {venue.price} kr / night
      </p>
    </div>
  );
}
