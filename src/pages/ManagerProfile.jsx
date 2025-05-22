import { useState } from "react";
import CreateVenueForm from "../components/CreateVenueForm";
import MyVenuesList from "../components/MyVenuesList";
import UpcomingBookings from "../components/UpcomingBookings";

export default function ManagerProfile() {
  const [activeSection, setActiveSection] = useState("createVenue");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="md:grid md:grid-cols-3 min-h-screen px-20 pt-6">
      {/* Sidebar */}
      <aside className="bg-white p-6 md:col-span-1 border-r">
        <div className="text-center">
          <img
            src={localStorage.getItem("avatarUrl") || "https://placehold.co/150x150?text=Avatar"}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border"
          />
          <h2 className="text-lg font-semibold pt-2">
            {localStorage.getItem("userName")} <span className="font-normal">Venue Manager</span>
          </h2>
          <p className="text-sm py-4 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
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
            className="block w-full text-left font-medium hover:underline"
          >
            My venues
          </button>
          <button
            onClick={() => handleSectionChange("bookings")}
            className="block w-full text-left font-medium hover:underline"
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
    </div>
  );
}
