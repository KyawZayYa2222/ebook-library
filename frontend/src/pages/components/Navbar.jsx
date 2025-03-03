import { Link } from "react-router-dom"
import SearchForm from "./SearchForm"

export default function Navbar() {
  return (
    <div className="flex md:flex-row flex-col justify-between md:items-center py-3 px-3 xl:px-0">
        <Link to={'/'} className="w-72 mb-3 md:mt-0">
            <h1 className="text-blue-700 text-4xl ">Toe Tatt</h1>
            <p className="text-gray-700 leading-3">Myanmar ebook library</p>
        </Link>

        <SearchForm/>
    </div>
  )
}
