import React, { useState } from "react"
import BookList from "./components/BookList";
import BookFilter from "./components/BookFilter";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";

export default function BookDetails() {
//   const [id] = React.useParams();
  const params = useParams();
  const [url, setUrl] = useState(`http://localhost:3000/books/${params.id}`)

  const { data: bookDetails, loading, error } = useFetch(url);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className=" w-full h-full p-3">
        <BookFilter />
      </div>
      <div className="col-span-4 p-3">
        <h2 className="text-3xl mb-3">Book Details</h2>
        {/* error  */}
        {error && (<div className="">{error}</div>)}
        {/* book details  */}
        {
            !error && bookDetails && (
                <div className="flex w-full p-3 border border-gray-200 rounded-lg">
                    <figure className="w-40">
                        <img src={bookDetails.image} alt="image" />
                    </figure>
                    <div className="ps-2">
                        <h3 className="text-2xl">{bookDetails.title}</h3>
                        <p>Author : {bookDetails.author}</p>
                        <p>Category : novel, poem, biology</p>
                        <p>Downloads : {bookDetails.download}</p>
                        <p>Size : 12.3Mb</p>
                        
                        <div className="flex mt-2">
                            {/* download btn  */}
                            <button type="button" className="flex me-2 cursor-pointer p-2 bg-green-600 hover:bg-green-700 delay-100 duration-150 text-white rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M5.5 20h13q.213 0 .356.144t.144.357t-.144.356T18.5 21h-13q-.213 0-.356-.144T5 20.499t.144-.356T5.5 20m6.48-3.298q-.181 0-.353-.08q-.171-.082-.292-.243l-3.989-5.292q-.298-.404-.077-.851t.723-.447h1.643V3.808q0-.343.232-.576T10.442 3h3.097q.343 0 .575.232t.232.576v5.98h1.643q.502 0 .723.448q.22.447-.077.85l-4.008 5.293q-.121.161-.293.242t-.353.081"></path></svg>
                            <p>Download</p>
                            </button>

                            {/* read btn  */}
                            <button type="button" className="flex cursor-pointer p-2 bg-blue-600 hover:bg-blue-700 delay-100 duration-150 text-white rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6.98 21q-.816 0-1.398-.541Q5 19.917 5 19.119V5.766q0-.778.53-1.364t1.306-.748l6.828-1.437q.751-.161 1.351.314t.6 1.252V15.11q0 .572-.363 1.01t-.91.562l-7.586 1.651q-.302.07-.529.276T6 19.12q0 .39.292.635t.689.245h10.404q.269 0 .442-.173t.173-.443V5.5q0-.213.143-.357T18.5 5t.357.143T19 5.5v13.885q0 .67-.472 1.143q-.472.472-1.143.472zm1.405-4.017l5.75-1.245q.211-.038.346-.211t.135-.385V3.808q0-.289-.231-.481t-.52-.135L8.386 4.36zm-1 .207V4.568l-.433.095q-.41.088-.68.391Q6 5.356 6 5.766v11.867q.183-.108.368-.184t.388-.12zM6 4.662v12.972z"></path></svg>  
                            <p>Read</p>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
      </div>
    </div>
    </>
  )
}
