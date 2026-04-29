import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Sign";
import BookListings from "./pages/BookListings";
import BookDetail from "./pages/BookDetail";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Wishlist from "./pages/Wishlist";
import Collection from "./pages/Collection";
import Transactions from "./pages/Transactions";
import OrderStatus from "./pages/OrderStatus";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Features from "./pages/Features";
import "./App.css";
import "./pages/Auth.css";
import "./components/PageLayout.css";

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main className="app-content" id="main-content" aria-live="polite">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sign" element={<SignUp />} />
          <Route path="/books" element={<BookListings />} />
          <Route path="/books/:listingId" element={<BookDetail />} />
          <Route path="/sell" element={<CreateListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/trades" element={<Transactions />} />
          <Route path="/orders" element={<OrderStatus />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
