import { Link } from "react-router-dom";

export default function AuthorCard({author}) {
  return (
    <Link to={`/search/${author.name}`} className="group" >
        <div className="group-hover:border-gray-400 delay-100 duration-150 w-full bg-white shadow-md border border-gray-200 rounded-lg p-3 flex items-center space-x-4">
        {/* Profile Image */}
        <img
            src={author.image}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
        />

        {/* Content */}
        <div className="mx-auto">
            <h2 className="text-lg text-gray-700">{author.name}</h2>
            <p className="text-gray-600">{author.count}</p>
        </div>
        </div>
    </Link>
  )
}
