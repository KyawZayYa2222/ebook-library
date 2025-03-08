import { NavLink, Outlet } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function AdminLayout() {
  const handleLogout = () => {
    // {data, loading, error} = useFetch()
    // handle logout logics 
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col space-y-4">
          <NavLink to="/admin" end 
          className={({isActive}) => `hover:bg-gray-700 p-2 rounded ${isActive ? 'bg-gray-700': ''}`}>
          Dashboard
          </NavLink>
          <NavLink to="/admin/books" 
          className={({isActive}) => `hover:bg-gray-700 p-2 rounded ${isActive ? 'bg-gray-700': ''}`}>
          Books
          </NavLink>
          <NavLink to="/admin/categories" 
          className={({isActive}) => `hover:bg-gray-700 p-2 rounded ${isActive ? 'bg-gray-700': ''}`}>
          Categories
          </NavLink>
          <NavLink to="/admin/authors" 
          className={({isActive}) => `hover:bg-gray-700 p-2 rounded ${isActive ? 'bg-gray-700': ''}`}>
          Authors
          </NavLink>
          <button
          className={`hover:bg-gray-700 p-2 rounded text-left`}
          onClick={handleLogout}>
          Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
