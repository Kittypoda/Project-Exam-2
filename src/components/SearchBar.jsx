import { useState } from "react";

export default function SearchBar({ onSearch, onClear, isSearching }) {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ location, guests, checkIn, checkOut });
  }

  function handleClear() {
    setLocation("");
    setGuests("");
    setCheckIn("");
    setCheckOut("");
    onClear();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4"
      >
        {/* Location - full width on small screens */}
        <div className="w-full sm:flex-1 min-w-[160px] max-w-[300px]">
          <label className="block text-sm font-alexandria mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where are you going?"
            className="w-full font-alexandria placeholder-black text-sm font-extralight border rounded-md p-2"
          />
        </div>

        {/* Check in */}
        <div className="flex-1 min-w-[130px] max-w-[200px]">
          <label className="block text-sm font-alexandria mb-1">Check in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full font-alexandria text-sm font-extralight border rounded-md p-2"
          />
        </div>

        {/* Check out */}
        <div className="flex-1 min-w-[130px] max-w-[200px]">
          <label className="block text-sm font-alexandria mb-1">Check out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full font-alexandria text-sm font-extralight border rounded-md p-2"
          />
        </div>

        {/* Guests */}
        <div className="flex-1 min-w-[130px] max-w-[200px]">
          <label className="block text-sm font-alexandria mb-1">Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Add guests"
            className="w-full font-alexandria text-sm font-extralight border rounded-md p-2"
          />
        </div>

        {/* Button group - aligned right */}
        <div className="ml-auto flex gap-4">
          {isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-blackish border border-blackish p-3 rounded-md hover:bg-lightgray transition"
            >
              Clear search
            </button>
          )}
          <button
            type="submit"
            className="w-24 bg-blackish text-white p-3 rounded-md shadow-md fa fa-search hover:bg-black transition"
          >
          </button>
        </div>
      </form>
    </div>
  );
}







