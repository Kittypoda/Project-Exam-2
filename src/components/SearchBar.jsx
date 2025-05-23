import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchBar({ onSearch, onClear, isSearching }) {
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ location, guests, checkIn, checkOut });
  }

  function handleClear() {
    setLocation('');
    setGuests('');
    setCheckIn(null);
    setCheckOut(null);
    onClear();
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-2 md:px-6">
      <form onSubmit={handleSubmit} className="grid gap-4 md:flex md:flex-wrap md:items-end">
        <div className="w-full md:flex-1 md:min-w-[160px] md:max-w-[300px]">
          <label className="block text-sm font-alexandria mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where are you going?"
            className="w-full font-alexandria placeholder-gray-600 text-sm font-extralight focus:outline-none focus:ring-0"
          />
        </div>

        <div className="grid grid-cols-1 grid-cols-3 gap-4 w-full md:flex md:flex-1">
          <div className="w-full md:min-w-[130px] md:max-w-[200px]">
            <label className="block text-sm font-alexandria mb-1">Check in</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              placeholderText="Check in"
              className="w-full font-alexandria text-sm placeholder-gray-600 font-extralight focus:outline-none focus:ring-0"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
            />
          </div>

          <div className="w-full md:min-w-[130px] md:max-w-[200px]">
            <label className="block text-sm font-alexandria mb-1">Check out</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              placeholderText="Check out"
              className="w-full font-alexandria text-sm placeholder-gray-600 font-extralight focus:outline-none focus:ring-0"
              dateFormat="yyyy-MM-dd"
              minDate={checkIn || new Date()}
            />
          </div>

          <div className="w-full md:min-w-[130px] md:max-w-[200px]">
            <label className="block text-sm font-alexandria mb-1">Guests</label>
            <input
              type="text"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Add guests"
              className="w-full font-alexandria text-sm font-extralight focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="w-full flex gap-4 md:ml-auto md:w-auto">
          {isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary w-full md:w-auto"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="w-full md:w-24 bg-blackish text-white p-3 rounded-md shadow-md fa fa-search transition hover:text-black hover:bg-mintgreen"
          ></button>
        </div>
      </form>
    </div>
  );
}
