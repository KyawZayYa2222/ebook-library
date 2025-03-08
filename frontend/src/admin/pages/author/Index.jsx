import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import Pagination from "../../../pages/components/Pagination";
import Loading from "../../../utils/Loading";

export default function Authors() {
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(`http://localhost:3000/authors?_page=${currentPage}&_per_page=${limit}`)

  const { data, loading, error } = useFetch(url, "GET", true);

  const onPageChange = (page) => {
    setCurrentPage(page)
    setUrl(`http://localhost:3000/authors?_page=${page}&_per_page=${limit}`)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Authors</h2>
      <div className="w-full flex justify-end">
      <Link to={'create'} className="p-2 text-gray-100 bg-blue-600 hover:bg-blue-700 delay-75 duration-150 rounded-md">Create</Link>
      </div>

      {/* loading  */}
      {loading && <Loading />}

      {/* error  */}
      {error && <div>{error}</div>}

      {/* not found  */}
      {!error && data && data.length === 0 && (
        <div className="w-full h-56 flex justify-center items-center rounded-xl text-gray-500 bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24"><path fill="currentColor" d="M7.885 16.616q.213 0 .356-.144t.144-.357V4.5q0-.213-.144-.356Q8.097 4 7.884 4t-.356.144t-.143.356v11.616q0 .212.144.356t.356.143M6.231 21q-.93 0-1.58-.65Q4 19.698 4 18.77V5.23q0-.929.65-1.58Q5.302 3 6.23 3H15q.666 0 1.14.475q.476.474.476 1.14V16q0 .666-.475 1.14q-.475.476-1.141.476H6.23q-.501 0-.865.341Q5 18.3 5 18.804t.365.85t.866.346h12.154q.269 0 .442-.173t.173-.442V5.5q0-.213.144-.356T19.501 5t.356.144T20 5.5v13.885q0 .666-.475 1.14t-1.14.475z"></path></svg>
          <p className="text-xl">Authors Not Found</p>
        </div>
      )}

      {/* result  */}
      {!error && data && (
        <table className="w-full border border-gray-300 mt-4 mb-2">
          <thead>
            <tr className="bg-gray-200">
              {
                ['ID', 'Name', 'Books', 'Created At', 'Actions'].map((item, index) => {
                  return <th key={index} className="p-2 border">{item}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
            {data.data.map((author) => (
              <tr key={author.id} className="text-center">
                <td className="p-2 border">{author.id}</td>
                <td className="p-2 border">{author.name}</td>
                <td className="p-2 border">2</td>
                <td className="p-2 border">2-2-2025</td>
                <td className="p-2 border">
                  <div className="flex justify-center">
                    <Link to={`${author.id}/edit`} className="p-2 text-sm me-2 text-gray-100 bg-blue-600 hover:bg-blue-700 delay-75 duration-150 rounded-md">Edit</Link>
                    <Link to={`/authors/${author.id}`} className="p-2 text-sm me-2 text-gray-100 bg-red-600 hover:bg-red-700 delay-75 duration-150 rounded-md">Delete</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* pagination  */}
      {!error && data && <Pagination totalItems={data.items} limit={limit} currentPage={currentPage} onPageChange={onPageChange}/>}

    </div>
  );
}
