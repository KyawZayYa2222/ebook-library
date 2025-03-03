import React from 'react'

export default function Pagination({totalItems, limit, currentPage = 1, onPageChange}) {
  return (
    <div className='w-full flex justify-end'>
        {/* prev btn  */}
        <button type='button' disabled={currentPage === 1}
            className={`
                cursor-pointer px-3 rounded-md py-2 mx-1 text-sm text-gray-600 border border-gray-300
                ${currentPage === 1? 'opacity-50' : ''}
            `}
            onClick={() => onPageChange(currentPage - 1)}
        >
            prev
        </button>
        {/* {<getPaginations/>} */}
        
        {
            Array.from({length: Math.ceil(totalItems / limit)}, (_, i) => i + 1).map((number) => {
                return (
                    
                    <button
                    type='button'
                        key={number}
                        className={`
                            cursor-pointer px-3 rounded-md py-2 mx-1 text-sm text-gray-600 border border-gray-300
                            ${number === currentPage? 'bg-blue-700 text-white' : ''}
                        `}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                )
            })
        }

        {/* next btn  */}
        <button
        type='button'
            disabled={currentPage === Math.ceil(totalItems / limit)}
            className={`
                cursor-pointer px-3 rounded-md py-2 mx-1 text-sm text-gray-600 border border-gray-300
                ${currentPage === Math.ceil(totalItems / limit)? 'opacity-50' : ''}
            `}
            onClick={() => onPageChange(currentPage + 1)}
        >
            next
        </button>
    </div>
  )
}
