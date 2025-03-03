import BookCard from "./BookCard";

export default function BookList({books}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-3">
        {books.map((book, index) => (
            <div key={index} className="w-full flex justify-center">
                <BookCard book={book} />
            </div>
        ))}
    </div>
  )
}
