// import Swiper core and required modules
import { Navigation, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import BookCard from './BookCard'
import { useRef } from 'react';
// import SwiperNavigation from './SwiperNavigation';

export default function BookCarousel({books}) {
  

  const swiperRef = useRef(null);
  return (
    <div className='relative'>
        {/* slide prev  */}
        <div className='absolute top-0 left-0 z-10 h-full flex items-center'>
        <button type='button' className='cursor-pointer text-gray-700' onClick={() => swiperRef.current.slidePrev()}>
        <svg xmlns="http://www.w3.org/2000/svg" width={56} height={56} viewBox="0 0 24 24"><path fill="currentColor" d="m10.108 12l4.246 4.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16l-4.388-4.389q-.131-.13-.184-.267q-.053-.136-.053-.298t.053-.298t.184-.267l4.388-4.389q.14-.14.344-.15t.364.15t.16.354t-.16.354z"></path></svg>
        </button>
        </div>

        <Swiper className='max-w-6xl'
        // install Swiper modules
        modules={[Navigation, A11y]}
        breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 }, // Mobile
            480: { slidesPerView: 3, spaceBetween: 10 }, // Small devices
            768: { slidesPerView: 4, spaceBetween: 15 }, // Tablets
            1024: { slidesPerView: 5, spaceBetween: 20 }, // Small desktops
            1280: { slidesPerView: 6, spaceBetween: 25 }, // Large screens
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)} // store swiper instance
        >
            {/* prev btn  */}
            {/* <SwiperNavigation type={'prev'}/> */}

            {
                books.map(book => (
                    <SwiperSlide key={book.id}>
                        <BookCard book={book}/>
                    </SwiperSlide>
                ))
            }

            {/* next btn  */}
            {/* <SwiperNavigation type={'next'}/> */}
        </Swiper>

        {/* slide next  */}
        <div className='absolute top-0 right-0 z-10 h-full flex items-center'>
            <button type='button' className='cursor-pointer text-gray-700' onClick={() => swiperRef.current.slideNext()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={56} height={56} viewBox="0 0 24 24"><path fill="currentColor" d="M13.292 12L9.046 7.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16l4.388 4.389q.131.13.184.267t.053.298t-.053.298t-.184.268l-4.388 4.388q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354z"></path></svg>
            </button>
        </div>
        
    </div>
  )
}
