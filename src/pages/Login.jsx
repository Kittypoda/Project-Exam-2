import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Husk å ha React Router satt opp

const BASE_URL = "https://v2.api.noroff.dev";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // For redirect etter login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login API response:", data);

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Login failed");
      }

      // ✅ Hent token og navn fra riktig sted i v2
      const { accessToken, name } = data.data;

      if (!accessToken || !name) {
        throw new Error("Unexpected API response");
      }

      // Lagre data i localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", name);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 1000); // Redirect etter 1 sek
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="you@stud.noroff.no"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Login
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
}



