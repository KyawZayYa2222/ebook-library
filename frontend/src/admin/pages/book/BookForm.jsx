import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import Select from 'react-select';

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [author, setAuthor] = useState("");
  const [authorOptions, setAuthorOptions] = useState([]);
  const [imageType, setImageType] = useState("upload"); // "upload" or "url"
  const [image, setImage] = useState("");
  const [bookType, setBookType] = useState("upload"); // "upload" or "url"
  const [bookFile, setBookFile] = useState("");

  const {data: categories} = useFetch('http://localhost:3000/categories');
  const {data: authors} = useFetch('http://localhost:3000/authors');

  const {id} = useParams();

  const {data: book} = useFetch(`http://localhost:3000/books/${id}`);

  useEffect(() => {
    if(categories) {
        categories.forEach(category => {
            setCategoryOptions((prevOptions) => [...prevOptions, { value: category.id, label: category.title }])
        })
    }
    if(authors) {
        authors.forEach(author => {
            setAuthorOptions((prevOptions) => [...prevOptions, { value: author.id, label: author.name }])
        })
    }

    if(id) {
      if(book) {
        setTitle(book.title);
        // setCategory 
        const matchCategories = categories.filter(item => book.category_ids.includes(Number(item.id)));
        setSelectedCategories(prev => 
          matchCategories.map(item => ({ value: item.id, label: item.title }))
        )
        // setAuthor 
        const matchAuthors = authors.filter(item => item.id == book.author_id);
        matchAuthors.map(item => setAuthor({ value: item.id, label: item.name}))
      }
    }
  }, [categories, authors, id, book])

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      selectedCategories,
      author,
      image,
      bookFile,
    };
    console.log("Form Submitted:", formData);
    // Handle form submission (API call, etc.)
  };

  return (
    <>
    <h2 className="text-2xl font-bold mb-2">Books</h2>
      <div className="w-full flex justify-end">
      <Link to={'/admin/books'} className="p-2 text-gray-100 bg-gray-600 hover:bg-gray-700 delay-75 duration-150 rounded-md">Back</Link>
      </div>
    <div className="max-w-2xl bg-white mx-auto mt-2 p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        {id? 'Update Book' : 'Create a New Book'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 outline-gray-400 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Categories (Multiple Select) */}
        <div>
          <label className="block text-gray-700">Categories</label>
          <Select 
          isMulti 
          value={selectedCategories} 
          onChange={(selected) => setSelectedCategories(selected)}
          options={categoryOptions} />
        </div>

        {/* Author (Single Select) */}
        <div>
          <label className="block text-gray-700">Author</label>
          <Select 
          value={author} 
          onChange={(selected) => setAuthor(selected)}
          options={authorOptions} />
        </div>

        {/* Image (Upload or URL) */}
        <div>
          <label className="block text-gray-700">Book Cover Image</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-1 rounded ${imageType === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setImageType("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded ${imageType === "url" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setImageType("url")}
            >
              URL
            </button>
          </div>
          {imageType === "upload" ? (
            <input
              type="file"
              className="w-full p-2 border border-gray-300 outline-gray-400 rounded mt-2"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          ) : (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 outline-gray-400 rounded mt-2"
              placeholder="Enter image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          )}
        </div>

        {/* Book File (Upload or URL) */}
        <div>
          <label className="block text-gray-700">Book File (PDF)</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-1 rounded ${bookType === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setBookType("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded ${bookType === "url" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setBookType("url")}
            >
              URL
            </button>
          </div>
          {bookType === "upload" ? (
            <input
              type="file"
              className="w-full p-2 border border-gray-300 outline-gray-400 rounded mt-2"
              accept="application/pdf"
              onChange={(e) => setBookFile(e.target.files[0])}
            />
          ) : (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 outline-gray-400 rounded mt-2"
              placeholder="Enter book file URL"
              value={bookFile}
              onChange={(e) => setBookFile(e.target.value)}
            />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {id? 'Update Book' : 'Create Book'}
        </button>
      </form>
    </div>
    </>
  );
};

export default BookForm;
