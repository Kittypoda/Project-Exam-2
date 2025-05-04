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

  return (
    <div className="max-w-md mx-auto text-center mt-12 space-y-4">
      <img
        src={profile.avatar?.url || "https://placehold.co/150x150?text=Avatar"}
        alt={profile.avatar?.alt || "Avatar"}
        className="w-32 h-32 mx-auto rounded-full object-cover border"
      />

      <h1 className="text-xl font-bold">{profile.name}</h1>

      <p className="text-gray-700">
        {profile.bio || <span className="italic text-gray-400">No bio added yet.</span>}
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Edit profile
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-medium">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border p-2 rounded"
                  rows="3"
                  placeholder="Write something about yourself..."
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-1 px-4 rounded"
                >
                  Save
                </button>
              </div>

              {status && <p className="text-sm text-green-700">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




