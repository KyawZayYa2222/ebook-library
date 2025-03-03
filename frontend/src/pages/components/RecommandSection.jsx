import { useState } from "react";
import BookCarousel from "./BookCarousel";
import useFetch from "../../hooks/useFetch";

export default function RecommandSection() {
  const [url, setUrl] = useState('http://localhost:3000/books');

  const { data: books, loading, error } = useFetch(url);

  return (
    <>
    
    <h2 className="text-lg mt-6 mb-3">Suggested books</h2>

    {error && (<div className="">{error}</div>)}
    {books && ( 
        <BookCarousel books={books} />
    )}
    </>
  )
}
