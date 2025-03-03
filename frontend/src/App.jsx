import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SearchResult from "./pages/SearchResult"
import Navbar from "./pages/components/Navbar"
import BookDetails from "./pages/BookDetails"

function App() {

  return (
    <BrowserRouter>
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/books/:id/details" element={<BookDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
