import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/snowcabin.png";

const BASE_URL = "https://v2.api.noroff.dev";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Login failed");
      }

      const { accessToken, name, avatar } = data.data;

      if (!accessToken || !name) {
        throw new Error("Unexpected API response");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", name);
      localStorage.setItem("avatarUrl", avatar?.url || "");

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
      {/* Left side: form */}
      <div className="flex justify-center px-8 py-40">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col"
        >
          <h1 className="font-alexandria font-semibold p-2 text-center">
            Log in
          </h1>
          <h2 className="text-center p-2">
            New here?{" "}
            <Link to="/register" className="underline text-underline">
              Register an account
            </Link>
          </h2>

          <input
            type="email"
            name="email"
            placeholder="example@stud.noroff.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input my-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input my-4"
          />

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="font-alexandria font-light mt-10">
          Turn your special spot into someone’s stay.
          </div>
          <button className="btn btn-secondary mt-4">
            <Link to="/managerlogin">Log in as a venue manager</Link>
          </button>
        </form>
      </div>

      {/* Right side: image (hidden on mobile) */}
      <div className="hidden px-6 pb-40 lg:block">
        <img
          src={loginImg}
          alt="Login visual"
          className="w-full max-h-[900px] min-h-[800px] object-cover rounded-2xl rounded-tr-none"
        />
      </div>
    </div>
  );
}




