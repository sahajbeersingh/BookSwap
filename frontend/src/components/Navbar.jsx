import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm">
      <Link to="/" className="text-xl font-bond">
        BookSwap
      </Link>

      <div className="space-x-4">
        <Link to="/login" className="text-gray-600 hover:text-black">
          Login
        </Link>
        <Link to="/register" className="text-gray-600 hover:text-black">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
