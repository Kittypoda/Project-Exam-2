import { useState } from "react";
import { API_KEY, BASE_URL } from "../utils/api";

export default function CreateVenueForm() {
  const accessToken = localStorage.getItem("accessToken");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([{ url: "", alt: "" }]);
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(1);
  const [meta, setMeta] = useState({ wifi: false, parking: false, breakfast: false, pets: false });
  const [location, setLocation] = useState({ city: "" });
  const [status, setStatus] = useState("");

  const handleMetaChange = (facility) => {
    setMeta({ ...meta, [facility]: !meta[facility] });
  };

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...media];
    newMedia[index][field] = value;
    setMedia(newMedia);
  };

  const handleAddMedia = () => {
    setMedia([...media, { url: "", alt: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const body = {
      name,
      description,
      media: media.filter((m) => m.url.trim() !== ""),
      price: Number(price),
      maxGuests: Number(maxGuests),
      meta,
      location: { ...location },
    };

    try {
      const response = await fetch(`${BASE_URL}/holidaze/venues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Something went wrong");
      }

      setStatus("Venue successfully created!");
      setName("");
      setDescription("");
      setMedia([{ url: "", alt: "" }]);
      setPrice(0);
      setMaxGuests(1);
      setMeta({ wifi: false, parking: false, breakfast: false, pets: false });
      setLocation({ city: "" });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Create new venue</h2>

      <input
        className="form-input w-full"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="form-input w-full"
        placeholder="Location"
        value={location.city}
        onChange={(e) => setLocation({ ...location, city: e.target.value })}
      />

      <textarea
        className="form-input w-full h-28"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="flex flex-wrap gap-2">
        {Object.entries(meta).map(([key, value]) => (
          <button
            type="button"
            key={key}
            onClick={() => handleMetaChange(key)}
            className={`px-4 py-2 rounded border shadow ${value ? "bg-primary text-white" : "bg-white"}`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="form-input"
          placeholder="Guests"
          type="number"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          required
        />
        <input
          className="form-input"
          placeholder="Price (NOK/day)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <p className="font-medium">Add image links</p>
        {media.map((m, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="form-input w-full"
              placeholder="Image URL"
              value={m.url}
              onChange={(e) => handleMediaChange(i, "url", e.target.value)}
            />
            <input
              className="form-input w-full"
              placeholder="Alt text"
              value={m.alt}
              onChange={(e) => handleMediaChange(i, "alt", e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="text-sm underline" onClick={handleAddMedia}>
          + Add more
        </button>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Save and publish
      </button>

      {status && <p className="text-sm pt-2">{status}</p>}
    </form>
  );
}