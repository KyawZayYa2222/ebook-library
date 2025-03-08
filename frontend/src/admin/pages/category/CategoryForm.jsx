import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const CategoryForm = () => {
  const [title, setTitle] = useState("");
  const [imageType, setImageType] = useState("upload"); // "upload" or "url"
  const [image, setImage] = useState("");

  const {id} = useParams();

  const {data: category} = useFetch(`http://localhost:3000/categories/${id}`);

  useEffect(() => {
    if(id) {
      if(category) {
        setTitle(category.title);
      }
    }
  }, [id, category])

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      image,
    };
    console.log("Form Submitted:", formData);
    // Handle form submission (API call, etc.)
  };

  return (
    <>
    <h2 className="text-2xl font-bold mb-2">Categories</h2>
      <div className="w-full flex justify-end">
      <Link to={'/admin/categories'} className="p-2 text-gray-100 bg-gray-600 hover:bg-gray-700 delay-75 duration-150 rounded-md">Back</Link>
      </div>
    <div className="max-w-2xl bg-white mx-auto mt-2 p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        {id ? 'Update Category' : 'Create a New Category'}
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

        {/* Image (Upload or URL) */}
        <div>
          <label className="block text-gray-700">Category Image</label>
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

        {/* Submit Button */}
        <button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {id? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
    </>
  );
};

export default CategoryForm;
