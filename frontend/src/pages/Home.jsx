import { Search, ArrowRight, BookOpen, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* SEARCH BAR */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN"
            className="flex-1 outline-none border-none text-sm text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center gap-8">
        {/* HERO */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Buy, Sell, Trade &amp; Lend Books
          </h1>
          <p className="text-base text-gray-500 leading-relaxed max-w-md">
            A community-driven marketplace for book lovers. Find your next read
            or give your books a new home.
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
            <Link
              to="/register"
              className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:underline"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <hr className="w-full border-gray-200" />

        {/* WHY BOOKSWAP */}
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-xl font-bold text-gray-900">Why BookSwap?</h2>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              <BookOpen size={28} className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                Buy &amp; Sell
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Find great deals on used books or sell your collection to fellow
                readers.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <RefreshCw size={28} className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                Trade &amp; Lend
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Swap books with others or lend your favorites to the community.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Users size={28} className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                Community
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Connect with book lovers in your area and discover new reads.
              </p>
            </div>
          </div>
        </div>

        <hr className="w-full border-gray-200" />

        {/* BOTTOM CTA */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">
            Ready to start swapping?
          </h2>
          <p className="text-base text-gray-500">
            Join thousands of book lovers already using BookSwap.
          </p>
          <Link
            to="/register"
            className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:underline mt-1"
          >
            Create Free Account <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
