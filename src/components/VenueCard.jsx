import { Link } from 'react-router-dom';
import fallbackImage from '../assets/fallback.png';

export default function VenueCard({ venue }) {
  const hasMedia = Array.isArray(venue.media) && venue.media.length > 0;
  const imageUrl = hasMedia ? venue.media[0]?.url : null;
  const alt = hasMedia ? venue.media[0]?.alt || venue.name : venue.name;
  const location = venue.location?.city || venue.location?.country || 'Unknown';

  return (
    <Link to={`/venue/${venue.id}`} className="block">
      <div className="p-4 flex flex-col bg-transparent hover:shadow-lg rounded-xl transition-shadow hover:bg-white">
        <img
          src={imageUrl || fallbackImage}
          alt={alt}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        <div className="font-alexandria text-black text-lg truncate">{venue.name}</div>

        <div className="font-alexandria text-black text-sm truncate">{location}</div>

        <p className="text-sm font-extralight mt-auto">{venue.price} kr / night</p>
      </div>
    </Link>
  );
}
