import { useState } from 'react';
import { API_KEY, BASE_URL } from '../utils/api';

export default function EditVenueModal({ venue, onClose, onUpdate }) {
  const accessToken = localStorage.getItem('accessToken');

  const [name, setName] = useState(venue.name || '');
  const [description, setDescription] = useState(venue.description || '');
  const [price, setPrice] = useState(venue.price || '');
  const [maxGuests, setMaxGuests] = useState(venue.maxGuests || '');
  const [venueLocation, setVenueLocation] = useState({
    city: venue.location?.city || '',
  });
  const [meta, setMeta] = useState({
    wifi: venue.meta?.wifi || false,
    parking: venue.meta?.parking || false,
    breakfast: venue.meta?.breakfast || false,
    pets: venue.meta?.pets || false,
  });
  const [media, setMedia] = useState(venue.media?.length ? venue.media : []);
  const [status, setStatus] = useState('');

  function handleMetaChange(key) {
    setMeta((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleMediaChange(index, field, value) {
    const updated = [...media];
    updated[index][field] = value;
    setMedia(updated);
  }

  function handleAddMedia() {
    setMedia([...media, { url: '', alt: '' }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');

    const updatedVenue = {
      name,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      location: venueLocation,
      media,
      meta,
    };

    try {
      const res = await fetch(`${BASE_URL}/holidaze/venues/${venue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(updatedVenue),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Update failed');

      setStatus('Venue updated successfully!');
      onUpdate();
      onClose();
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-sm font-alexandria">
          Close
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl pb-20">
          <h1 className="text-2xl font-normal pb-4">Edit venue</h1>

          <div className="text-sm font-alexandria font-light text-blackish">
            Give your venue a unique and catchy name that stands out.
            <input
              className="form-input w-full text-black"
              placeholder="Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="text-sm font-alexandria font-light text-blackish">
            Where is your place located?
            <input
              className="form-input w-full text-black"
              placeholder="Location"
              value={venueLocation.city}
              onChange={(e) => setVenueLocation({ ...venueLocation, city: e.target.value })}
            />
          </div>

          <div className="text-sm font-alexandria font-light text-blackish">
            Tell guests what makes your place special.
            <textarea
              className="form-input w-full h-40 text-black"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="text-sm font-alexandria font-light text-blackish">
            Facilities
            <div className="flex flex-wrap gap-2">
              {Object.entries(meta).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleMetaChange(key)}
                  className={`px-4 py-2 font-alexandria font-light text-black text-sm rounded shadow hover:bg-mintgreen ${
                    value ? 'bg-mintgreen' : 'bg-white'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm font-alexandria font-light text-blackish">
            Details
            <div className="grid grid-cols-2 gap-4">
              <input
                className="form-input text-black"
                placeholder="Guests"
                type="text"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                required
              />
              <input
                className="form-input"
                placeholder="Price NOK/day"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-alexandria font-light text-blackish">Add image links</div>
            {media.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="form-input w-full text-black"
                  placeholder="Image URL"
                  value={m.url}
                  onChange={(e) => handleMediaChange(i, 'url', e.target.value)}
                />
                <input
                  className="form-input w-full"
                  placeholder="Alt text"
                  value={m.alt}
                  onChange={(e) => handleMediaChange(i, 'alt', e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm underline font-alexandria text-blackish"
              onClick={handleAddMedia}
            >
              + Add more
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Save changes
          </button>

          {status && <p className="text-sm pt-2 text-red-500">{status}</p>}
        </form>
      </div>
    </div>
  );
}
