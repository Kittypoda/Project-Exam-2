import { useEffect, useState } from "react";

const BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = "96ad7b42-c2fc-4679-b557-4401dcf0e962"; 

export default function Profile() {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

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
        console.log("Fetched profile:", data);

        if (response.status === 404) {
          throw new Error("Profile not found – does this user exist?");
        }

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message || "Failed to fetch profile");
        }

        if (!data.data) {
          throw new Error("Missing 'data' in response");
        }

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
      setStatus("Profile updated!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      setStatus(err.message || "Something went wrong");
    }
  };

  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center mt-8">Loading profile...</p>;
  }

  const displayName = profile?.name
  ? profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
  : "";


  return (
    <div className="max-w-md mx-auto text-center mt-12 p-10">
      <img
        src={profile.avatar?.url || "https://placehold.co/150x150?text=Avatar"}
        alt={profile.avatar?.alt || "Avatar"}
        className="w-32 h-32 mx-auto rounded-full object-cover border"
      />

    <h1 className="text-xl pt-2">{displayName}</h1>


      <p className="text-gray-700 pt-2 pb-6">
        {profile.bio || <span className="">No bio added yet.</span>}
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary w-full"
      >
        Edit profile
      </button>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl max-w-xl w-full space-y-4 shadow-lg">
      <div className="flex justify-end">
        <button onClick={() => setIsModalOpen(false)} className="text-sm font-alexandria">
          Close
        </button>
      </div>

      {/* Avatar preview */}
      
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
          className="w-full text-sm font-alexandria font-light p-4 rounded-xl shadow-md"
          placeholder="New image link"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full h-40 text-sm font-alexandria font-light p-4 rounded-xl shadow-md"
          rows="3"
          placeholder="Write something about yourself..."
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Save changes
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}




