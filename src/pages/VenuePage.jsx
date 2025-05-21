import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faDog,
  faParking,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";
import ModalShell from "../components/ModalShell";
import { BASE_URL, API_KEY } from "../utils/api";

export default function VenuePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/venues/${id}?_bookings=true&_owner=true`,
          {
            headers: {
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        if (!response.ok) throw new Error("Venue not found");
        const data = await response.json();
        setVenue(data.data);
        setBookedDates(getDisabledDates(data.data.bookings));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % (venue?.media?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [venue]);

  function getDisabledDates(bookings) {
    const dates = [];
    bookings.forEach(({ dateFrom, dateTo }) => {
      let current = new Date(dateFrom);
      const end = new Date(dateTo);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }

  function handleInitialReserve() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
  
    if (!startDate || !endDate || !guests || !venue?.id) {
      alert("Please fill in all fields");
      return;
    }
  
    const diff = endDate - startDate;
    const calculatedNights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setNights(calculatedNights);
    setTotalPrice(calculatedNights * venue.price);
    setShowConfirmModal(true);
  }
  

  async function handleBookingConfirm() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowConfirmModal(false);
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          guests,
          venueId: venue.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.errors?.[0]?.message || "Booking failed");

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert(`Booking failed: ${err.message}`);
    }
  }

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error) return <div className="text-center mt-12">Error: {error}</div>;
  if (!venue) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 pb-56 md:pb-0">
      {/* Image Carousel */}
      <div>
        {venue.media?.length > 0 && (
          <div
            className="relative select-none"
            onClick={() => setCurrentImg((prev) => (prev + 1) % venue.media.length)}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const touchEndX = e.changedTouches[0].clientX;
              const diff = touchStartX - touchEndX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  setCurrentImg((prev) => (prev + 1) % venue.media.length);
                } else {
                  setCurrentImg((prev) => (prev - 1 + venue.media.length) % venue.media.length);
                }
              }
            }}
          >
            <img
              src={venue.media[currentImg].url}
              alt={venue.media[currentImg].alt || `Image ${currentImg + 1}`}
              className="rounded-xl w-full h-96 md:h-[27rem] object-cover cursor-pointer"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {venue.media.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === currentImg ? "bg-white" : "bg-gray-400"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImg(i);
                  }}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info + Booking */}
      <div className="flex flex-col gap-2 pt-6">
        <h1 className="text-2xl font-medium">{venue.name}</h1>
        <h2>{venue.location.city}, {venue.location.country}</h2>
        <p className="text-lg font-medium">{venue.maxGuests} Guests</p>
        <p className="text-lg font-medium">{venue.price} NOK / night</p>

        <div className="pt-6 font-alexandria text-xl hidden md:block">Booking</div>
        <div className="bg-lightgray md:text-center rounded-2xl shadow-xl pl-10 py-5 md:py-10 md:px-2 md:static fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="font-alexandria pb-4 text-xl text-left block md:hidden">Booking</div>
            <div className="grid grid-cols-3 font-alexandria">
              <div>
                <label className="block text-md mb-1">Check in</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="w-full bg-transparent md:text-center font-thin placeholder-black rounded-md"
                  minDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-md mb-1">Check out</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="w-full bg-transparent md:text-center font-thin placeholder-black"
                  minDate={startDate || new Date()}
                />
              </div>
              <div>
                <label className="block text-md mb-1">Guests</label>
                <input
                  type="number"
                  min="1"
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  placeholder="Add guests"
                  className="bg-transparent md:text-center font-thin placeholder-black rounded-md w-20"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button onClick={handleInitialReserve} className="btn btn-primary w-40 mt-4">
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities + Description */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-2">Facilities</h2>
        <ul className="list-none mb-6 space-y-2">
          {venue.meta.wifi && <li className="flex items-center gap-2 text-blackish"><FontAwesomeIcon icon={faWifi} /> Wifi</li>}
          {venue.meta.pets && <li className="flex items-center gap-2 text-blackish"><FontAwesomeIcon icon={faDog} /> Pets allowed</li>}
          {venue.meta.parking && <li className="flex items-center gap-2 text-blackish"><FontAwesomeIcon icon={faParking} /> Parking</li>}
          {venue.meta.breakfast && <li className="flex items-center gap-2 text-blackish"><FontAwesomeIcon icon={faCoffee} /> Breakfast</li>}
        </ul>
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="mb-4">{venue.description}</p>
        <p className="text-md font-normal pb-6">Hosted by {venue.owner?.name || "Unknown"}</p>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ModalShell onClose={() => setShowConfirmModal(false)}>
          <h1 className="text-center font-semibold pt-10 mb-2 text-xl">Confirm booking</h1>
          <p className="mb-4 text-center">
            {nights} night{nights > 1 && "s"} x {venue.price} NOK<br />
            <strong>Total: {totalPrice} NOK</strong>
          </p>
          <div className="flex justify-center gap-4 px-16">
            <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary w-full">Cancel</button>
            <button onClick={handleBookingConfirm} className="btn btn-primary w-full">Reserve</button>
          </div>
        </ModalShell>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalShell onClose={() => setShowSuccessModal(false)}>
          <h1 className="text-center font-semibold pt-10 mb-2 text-xl">Success! Your stay is booked.</h1>
          <p className="text-center mb-4 font-extralight">A confirmation has been sent to your email.</p>
          <div className="flex flex-col gap-3 px-16">
            <button onClick={() => (window.location.href = "/profile")} className="btn btn-primary">View my bookings</button>
            <button onClick={() => (window.location.href = "/")} className="text-sm underline text-gray-600 hover:text-black">Go back home</button>
          </div>
        </ModalShell>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <ModalShell onClose={() => setShowLoginModal(false)}>
          <h1 className="text-center font-semibold pt-10 mb-2 text-xl">Hold on! You need to log in</h1>
          <p className="text-center mb-4 font-extralight">Sign in to continue – it only takes a moment!</p>
          <div className="flex justify-center gap-3 px-16">
            <button onClick={() => (window.location.href = "/login")} className="btn w-full btn-primary">
              Log in
            </button>
            <button onClick={() => (window.location.href = "/register")} className="btn w-full btn-primary">
            Create account
            </button>
          </div>
          <div
            onClick={() => setShowLoginModal(false)}
            className="text-center font-alexandria text-sm mt-4 underline cursor-pointer hover:text-black"
          >
            or go back to venue
          </div>
        </ModalShell>
      )}
    </div>
  );
}





