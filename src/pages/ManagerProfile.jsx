import { useEffect, useState } from "react";
import CreateVenueForm from "../components/CreateVenueForm";
import MyVenuesList from "../components/MyVenuesList";
import UpcomingBookings from "../components/UpcomingBookings";
import { API_KEY, BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ManagerProfile() {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");
  const isVenueManager = localStorage.getItem("isVenueManager") === "true";

  const navigate = useNavigate();

  useEffect(() => {
    if (!isVenueManager) {
      navigate("/profile");
    }
  }, [isVenueManager, navigate]);

  const [activeSection, setActiveSection] = useState("createVenue");
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatarUrl") || "");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}/holidaze/profiles/${userName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.errors?.[0]?.message || "Failed to fetch profile");

        setAvatarUrl(data.data.avatar?.url || "");
        setBio(data.data.bio || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }

    fetchProfile();
  }, [userName, accessToken]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

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
      if (!response.ok) throw new Error(data.errors?.[0]?.message || "Update failed");

      localStorage.setItem("avatarUrl", data.data.avatar?.url || "");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      setStatus(err.message || "Something went wrong");
    }
  };

  return (
    <div className="md:grid md:grid-cols-3 max-w-6xl mx-auto min-h-screen pt-4 px-4">
      {/* Sidebar */}
      <aside className="bg-lightgray px-5 p-6 md:col-span-1">
        <div className="text-center pt-6">
          <img
            src={avatarUrl || "https://placehold.co/150x150?text=Avatar"}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border"
          />
          <h2 className="text-lg font-semibold pt-2">
            {userName} <span className="font-normal">Venue Manager</span>
          </h2>
          <p className="text-sm py-4 text-gray-600">
            {bio || <span>No bio added yet.</span>}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm underline font-alexandria text-blackish mb-4"
          >
            Edit profile
          </button>
          <button
            onClick={() => handleSectionChange("createVenue")}
            className="btn btn-primary w-full mb-6"
          >
            Add a venue
          </button>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => handleSectionChange("myVenues")}
            className="block font-alexandria w-full text-left hover:underline"
          >
            My venues
          </button>
          <button
            onClick={() => handleSectionChange("bookings")}
            className="block w-full text-left font-alexandria hover:underline"
          >
            Upcoming bookings
          </button>
        </nav>
      </aside>

      {/* Right Panel */}
      <main className="md:col-span-2 p-6">
        {activeSection === "createVenue" && <CreateVenueForm />}
        {activeSection === "myVenues" && <MyVenuesList />}
        {activeSection === "bookings" && <UpcomingBookings />}
      </main>

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



