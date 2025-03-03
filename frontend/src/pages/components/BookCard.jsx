import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({book}) {
  return (
    <Link to={`/books/${book.id}/details`} className="w-full flex justify-center">
    <div className="relative w-40 h-56 rounded-lg overflow-hidden border border-gray-200 shadow-md group">
      {/* Background Image */}
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${book.image})` }}
      ></div>

      {/* Hover Content */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center text-white">
        <h2 className="text-lg font-bold">{book.title}</h2>
        <p className="text-sm mt-2">See Details</p>
      </div>
    </div>
    </Link>
  )
}
