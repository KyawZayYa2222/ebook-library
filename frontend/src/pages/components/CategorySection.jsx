import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard"
import { useState } from "react";
import useFetch from "../../hooks/useFetch";

export default function CategorySection() {
  const [url, setUrl] = useState('http://localhost:3000/categories');

  const {data: categories, loading, error} = useFetch(url);

  return (
    <div className="md:px-2 px-4">
      <h2 className="text-lg mt-6 mb-3">Categories</h2>
      {error && (<div className="">{error}</div>)}
      {
        !error && (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" >
              {categories && categories.map((category, index) => (
                  <CategoryCard 
                  key={index} 
                  category={category} />
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
