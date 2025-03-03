import AuthorCard from "./AuthorCard";
import { Link } from "react-router-dom";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";

export default function AuthorSection() {
  const [url, setUrl] = useState('http://localhost:3000/authors');

  const {data: authors, loading, error} = useFetch(url);

  return (
    <div className="md:px-2 px-4 mb-6">
        <h2 className="text-lg mt-5 mb-3">Authors</h2>

        {error && (<div className="">{error}</div>)}
        {
            !error && (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {authors && authors.map((author, index) => (
                        <AuthorCard key={index} author={author} />
                    ))}
                </div>
                <Link to={`search/all`}>
                <p className="text-blue-700 text-right mt-3">See all</p>
                </Link>
                </>
            )
        }
        
    </div>
  )
}
