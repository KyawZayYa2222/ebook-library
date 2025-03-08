import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SearchResult from "./pages/SearchResult"
import BookDetails from "./pages/BookDetails"
import UserLayout from "./UserLayout"
import AdminLayout from "./admin/AdminLayout"
import Dashboard from "./admin/pages/Dashboard"
import AdminRoute from "./routes/AdminRoute"
import Login from "./admin/pages/Login"
import PageNotFound from "./PageNotFound"
import Books from "./admin/pages/book/Index"
import Categories from "./admin/pages/category/Index"
import BookForm from "./admin/pages/book/BookForm"
import CategoryForm from "./admin/pages/category/CategoryForm"
import Authors from "./admin/pages/author/Index"
import AuthorForm from "./admin/pages/author/AuthorForm"
 
function App() {

  return (
    // const [sta]
    <BrowserRouter>
      <div >
        <Routes>
          <Route path="*" element={<PageNotFound/>} />
          {/* login route  */}
          <Route path="/login" element={<Login />} />

          {/* admin routes  */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />} >
              <Route index element={<Dashboard />} />
              <Route path="books" >
                <Route index element={<Books />} />
                <Route path="create" element={<BookForm/>} />
                <Route path=":id/edit" element={<BookForm />} />
              </Route>
              <Route path="categories">
                <Route index element={<Categories />} />
                <Route path="create" element={<CategoryForm/>} />
                <Route path=":id/edit" element={<CategoryForm />} />
              </Route>
              <Route path="authors">
                <Route index element={<Authors />} />
                <Route path="create" element={<AuthorForm/>} />
                <Route path=":id/edit" element={<AuthorForm />} />
              </Route>
            </Route>
          </Route>

          {/* user routes  */}
          <Route element={<UserLayout />} >
            <Route path="/" element={<Home />} />
            <Route path="/search/:query" element={<SearchResult />} />
            <Route path="/books/:id/details" element={<BookDetails />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
