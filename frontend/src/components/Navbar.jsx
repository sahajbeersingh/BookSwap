import { Link } from "react-router-dom";
import { BookMarked } from "lucide-react";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-gray-900"
      >
        <BookMarked className="h-6 w-6 text-emerald-600" />
        BookSwap
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-gray-600 hover:text-gray-900 font-medium transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
