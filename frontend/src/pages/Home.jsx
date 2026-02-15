function Home() {
  return (
    <div className="px-6 py-20 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Buy, Sell, Trade & Lend Books</h1>

      <p className="text-gray-600 mb-8">
        A community-driven marketplace for book lovers.
      </p>

      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>
    </div>
  );
}

export default Home;
