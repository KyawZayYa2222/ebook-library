import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch';

export default function BookFilter() {
  const [categoryUrl, setCategoryUrl] = useState('http://localhost:3000/categories');
  const [authorUrl, setAuthorUrl] = useState('http://localhost:3000/authors');

  const { data:categories, loading: cateLoading, error: cateError } = useFetch(categoryUrl)
  const { data:authors, loading: authorLoading, error: authorError } = useFetch(authorUrl)

  return (
    <div>
      <h2 className="text-xl my-3 border border-t-0 border-s-0 border-e-0 border-gray-300 pb-2">Categories</h2>
      {cateError && (<div className="">{cateError}</div>)}
      {
        !cateError && (
          <ul>
            {categories && categories.map((category, index) => (
                <li className=' list-none mb-2' key={index}>
                    {category.title} <small className='text-sm text-gray-100 bg-blue-600 rounded-full px-2'>{category.count}</small>
                </li>
            ))}
          </ul>
        )
      }

    <h2 className="text-lg my-3 border border-t-0 border-s-0 border-e-0 border-gray-300 pb-2">Authors</h2>
      {authorError && (<div className="">{authorError}</div>)}
      {
        !authorError && (
          <ul>
            {authors && authors.map((author, index) => (
                <li className=' list-none mb-2' key={index}>
                    {author.name} <small className='text-sm text-gray-100 bg-blue-600 rounded-full px-2'>{author.count}</small>
                </li>
            ))}
          </ul>
        )
      }
    </div>
  )
}
