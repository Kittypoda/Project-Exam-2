import { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../utils/api";
import { Link } from "react-router-dom";

export default function Profile() {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      if (!userName || !accessToken) {
        setError("You must be logged in.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/holidaze/profiles/${userName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        const data = await response.json();

        if (response.status === 404) throw new Error("Profile not found – does this user exist?");
        if (!response.ok) throw new Error(data.errors?.[0]?.message || "Failed to fetch profile");
        if (!data.data) throw new Error("Missing 'data' in response");

        setProfile(data.data);
        setBio(data.data.bio || "");
        setAvatarUrl(data.data.avatar?.url || "");
        setError("");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Something went wrong");
      }
    }

    fetchProfile();
  }, [userName, accessToken]);

  useEffect(() => {
    async function fetchBookings() {
      if (!userName || !accessToken) return;

      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/profiles/${userName}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message || "Failed to fetch bookings");
        }

        const sorted = data.data.sort(
          (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
        );

        setBookings(sorted);
      } catch (err) {
        console.error("Booking fetch error:", err);
      }
    }

    fetchBookings();
  }, [userName, accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const response = await fetch(`${BASE_URL}/holidaze/profiles/${userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          bio,
          avatar: {
            url: avatarUrl,
            alt: `${userName}'s avatar`,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Update failed");
      }

      setProfile(data.data);
      localStorage.setItem("avatarUrl", data.data.avatar?.url || "");
      setStatus("Profile updated!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      setStatus(err.message || "Something went wrong");
    }
  };

  if (error) {
    return <p className="text-center mt-8">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center mt-8">Loading profile...</p>;
  }

  const displayName = profile?.name
    ? profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
    : "";

  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = new Date(booking.dateFrom);
    const key = date.toLocaleString("default", { month: "long", year: "numeric" });

    if (!acc[key]) acc[key] = [];
    acc[key].push(booking);

    return acc;
  }, {});

  return (
    <div className="max-w-md mx-auto text-center mt-12 p-10">
      <img
        src={profile.avatar?.url || "https://placehold.co/150x150?text=Avatar"}
        alt={profile.avatar?.alt || "Avatar"}
        className="w-32 h-32 mx-auto rounded-full object-cover border"
      />

      <h1 className="text-xl pt-2">{displayName}</h1>

      <p className="text-sm pt-2 pb-6">
        {profile.bio || <span>No bio added yet.</span>}
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary w-full"
      >
        Edit profile
      </button>

      <div className="mt-12 text-left">
        <h2 className="text-xl font-normal mb-4">Your upcoming bookings</h2>

        {Object.keys(groupedBookings).length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          Object.entries(groupedBookings).map(([monthYear, group]) => (
            <div key={monthYear} className="mb-6">
              <h3 className="text-lg font-alexandria font-light mb-2">{monthYear}</h3>

              <div className="space-y-4">
                {group.map((booking) => {
                  const venue = booking.venue;
                  const dateFrom = new Date(booking.dateFrom);
                  const dateTo = new Date(booking.dateTo);

                  const formatDate = (date) =>
                    `${date.getDate()}. ${date.toLocaleString("default", {
                      month: "short",
                    })}`;

                  return (
                    <Link
                      to={`/venue/${venue.id}`}
                      key={booking.id}
                      className="flex gap-4 items-center p-4 transition"
                    >
                      <img
                        src={venue?.media?.[0]?.url || "https://placehold.co/100x100"}
                        alt={venue?.media?.[0]?.alt || "Venue image"}
                        className="w-24 h-24 rounded object-cover"
                      />
                      <div>
                        <h2 className="font-alexandria font-medium">{venue.name}</h2>
                        <p>
                          {formatDate(dateFrom)} - {formatDate(dateTo)}
                        </p>
                        <p>Guests: {booking.guests}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-xl w-full space-y-4 shadow-lg">
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm font-alexandria"
              >
                Close
              </button>
            </div>

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-24 h-24 mx-auto rounded-full object-cover bg-lightgray text-lightgray"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-lightgray" />
            )}

            <form onSubmit={handleUpdate} className="space-y-4 px-20 pb-20">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="form-input"
                placeholder="New image link"
              />

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-input h-40"
                rows="3"
                placeholder="Write something about yourself..."
              />

              <button type="submit" className="btn btn-primary w-full">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






