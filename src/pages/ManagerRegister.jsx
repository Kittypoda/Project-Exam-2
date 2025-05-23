import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import registerImg from "../assets/poolwoman.png";

const API_URL = "https://v2.api.noroff.dev";

export default function ManagerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: true,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Registration failed");
      }

      localStorage.setItem("isVenueManager", "true");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
      {/* Left side: form */}
      <div className="flex justify-center px-8 py-40">
        <div className="w-full max-w-md flex flex-col items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col"
          >
            <h1 className="font-alexandria font-semibold p-2 text-center">
              Become a venue manager
            </h1>
            <h2 className="text-center p-2">
              Already registered?{" "}
              <Link to="/login" className="underline text-underline">
                Log in here
              </Link>
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input my-4"
            />
            <input
              type="email"
              name="email"
              placeholder="example@stud.noroff.no"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input my-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input my-4"
            />

            <button type="submit" className="btn btn-primary w-full">
              Register as manager
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>

          {/* Call to action */}
          <div className=" mt-10 w-full">
            <div className="font-alexandria font-light">
              A bed for every adventure
            </div>
            <Link to="/register" className="btn btn-secondary text-center mt-4 w-full inline-block">
              Go to traveler register
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: image (hidden on mobile) */}
      <div className="hidden px-6 pb-40 lg:block">
        <img
          src={registerImg}
          alt="Registration"
          className="w-full max-h-[900px] min-h-[800px] object-cover rounded-2xl rounded-tr-none"
        />
      </div>
    </div>
  );
}

