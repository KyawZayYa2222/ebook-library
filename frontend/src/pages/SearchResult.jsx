import React, { useState } from "react"
import BookList from "./components/BookList";
import BookFilter from "./components/BookFilter";
import useFetch from "../hooks/useFetch";
import Pagination from "./components/Pagination";

export default function SearchResult() {
  const [limit, setLimit] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(`http://localhost:3000/books?_page=${currentPage}&_per_page=${limit}`)

  const { data, loading, error } = useFetch(url, "GET", true);

  const onPageChange = (page) => {
    console.log(page)
    setCurrentPage(page)
    setUrl(`http://localhost:3000/books?_page=${page}&_per_page=${limit}`)
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className=" w-full h-full p-3">
        <BookFilter />
      </div>
      <div className="col-span-4 p-3">
        <h2 className="text-3xl mb-3">Search Result</h2>
        {/* loading  */}
        {loading && (
          <div className="w-full mb-2 flex justify-center items-center">
            <div role="status">
                <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            <p className="ms-2">Loading ...</p>
          </div>
        )}

        {/* error  */}
        {error && <div>{error}</div>}

        {/* not found  */}
        {!error && data && data.length === 0 && (
          <div className="w-full h-56 flex justify-center items-center rounded-xl text-gray-500 bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24"><path fill="currentColor" d="M7.885 16.616q.213 0 .356-.144t.144-.357V4.5q0-.213-.144-.356Q8.097 4 7.884 4t-.356.144t-.143.356v11.616q0 .212.144.356t.356.143M6.231 21q-.93 0-1.58-.65Q4 19.698 4 18.77V5.23q0-.929.65-1.58Q5.302 3 6.23 3H15q.666 0 1.14.475q.476.474.476 1.14V16q0 .666-.475 1.14q-.475.476-1.141.476H6.23q-.501 0-.865.341Q5 18.3 5 18.804t.365.85t.866.346h12.154q.269 0 .442-.173t.173-.442V5.5q0-.213.144-.356T19.501 5t.356.144T20 5.5v13.885q0 .666-.475 1.14t-1.14.475z"></path></svg>
            <p className="text-xl">Book Not Found</p>
          </div>
        )}

        {/* result  */}
        {!error && data && <BookList books={data.data} />}

        {/* pagination  */}
        {!error && data && <Pagination totalItems={data.items} limit={limit} currentPage={currentPage} onPageChange={onPageChange}/>}

        {/* {!error && totalCount && (<div>{totalCount}</div>)} */}
      </div>
    </div>
    </>
  )
}
