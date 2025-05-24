import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../utils/api';
import ModalShell from './ModalShell';

export default function CreateVenueForm() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([{ url: '', alt: '' }]);
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [meta, setMeta] = useState({ wifi: false, parking: false, breakfast: false, pets: false });
  const [venueLocation, setVenueLocation] = useState({ city: '' });
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleMetaChange = (facility) => {
    setMeta({ ...meta, [facility]: !meta[facility] });
  };

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...media];
    newMedia[index][field] = value;
    setMedia(newMedia);
  };

  const handleAddMedia = () => {
    setMedia([...media, { url: '', alt: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const guestsNum = Number(maxGuests);
    const priceNum = Number(price);

    if (isNaN(guestsNum) || guestsNum <= 0 || isNaN(priceNum) || priceNum < 0) {
      setStatus('Please enter valid positive numbers for guests and price.');
      return;
    }

    const body = {
      name,
      description,
      media: media.filter((m) => m.url.trim() !== ''),
      price: priceNum,
      maxGuests: guestsNum,
      meta,
      location: { ...venueLocation },
    };

    try {
      const response = await fetch(`${BASE_URL}/holidaze/venues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || 'Something went wrong');
      }

      // Tilbakestill skjema
      setName('');
      setDescription('');
      setMedia([{ url: '', alt: '' }]);
      setPrice('');
      setMaxGuests('');
      setMeta({ wifi: false, parking: false, breakfast: false, pets: false });
      setVenueLocation({ city: '' });
      setShowModal(true);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl pb-20">
        <h1 className="text-xl font-normal pb-4">Create new venue</h1>

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
          Save and publish
        </button>

        {status && <p className="text-sm pt-2 text-red-500">{status}</p>}
      </form>

      {showModal && (
        <ModalShell onClose={() => setShowModal(false)}>
          <div className="text-center space-y-4 p-6">
            <h1 className="text-xl font-medium pt-4">Venue Created!</h1>
            <p className="text-sm font-extralight">
              Your venue is now visible to guests. You can edit it anytime.
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate('/managerprofile', { state: { scrollTo: 'venues' } });
                }}
              >
                See my venues
              </button>
            </div>

            <p onClick={() => navigate('/')} className="text-sm underline cursor-pointer">
              Or go to homepage
            </p>
          </div>
        </ModalShell>
      )}
    </>
  );
}
