import { Link } from "react-router-dom"

export default function CategoryCard({category}) {
//   const { title, count } = useParams();

  return (
    <Link to={`search/${category.title}`} className="group">
    <div className="relative w-full h-44 overflow-hidden mx-auto">
        <div className="bg-cover bg-center w-full h-full rounded-lg" style={{ backgroundImage: `url(${category.image})` }}>
            <div className="flex items-center justify-center h-full rounded-lg">
            <div className="group-hover:h-full group-hover:rounded-md delay-100 duration-300 text-center w-full h-24 flex flex-col justify-center text-white p-3 bg-black/50">
                <h2 className="text-xl">{category.title}</h2>
                <p className="mt-1">{category.count || 0}</p>
            </div>
            </div>
        </div>
    </div>
    </Link>
    
  )
}
