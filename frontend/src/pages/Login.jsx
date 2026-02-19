import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle login logic
    console.log("Login submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* NAV */}
      <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-gray-900 no-underline"
        >
          <div className="w-6 h-6 bg-purple-700 rounded flex items-center justify-center text-white text-xs">
            <BookOpen size={13} />
          </div>
          BookSwap
        </Link>
        <div className="flex gap-1">
          <Link
            to="/login"
            className="text-sm text-purple-700 px-2 py-1 hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-purple-700 px-2 py-1 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* FORM */}
      <main className="max-w-sm mx-auto px-6 py-16 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your BookSwap account
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-xs text-purple-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-700 text-white text-sm font-medium py-2 rounded-md hover:bg-purple-800 transition-colors flex items-center justify-center gap-1 mt-1"
          >
            Sign In <ArrowRight size={14} />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-700 font-medium hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </main>
    </div>
  );
}
