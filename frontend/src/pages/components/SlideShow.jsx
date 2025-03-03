import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import "swiper/css";
import "swiper/css/autoplay";
import slideshow01 from '../../assets/books.png'

export default function SlideShow() {
  const slides = [
    {
      id: 1,
      title: 'Slide 1',
      image: '../../assets/library-slide.jpg',
    },
    {
      id: 2,
      title: 'Slide 2',
      image: '../../assets/slideshow01.jpg',
    },
    {
        id: 3,
        title: 'Slide 3',
        image: '../../assets/slideshow01.jpg',
    },
  ];

  return (
    <div className="mt-3">
        <Swiper 
        slidesPerView={1}
        loop={true}
        autoplay={{delay: 5000, disableOnInteraction:false}}
        modules={[Autoplay]}
        className='w-full'>
            {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
                {/* <h3>{slide.title}</h3>  */}
                <img src={slideshow01} alt={slide.id} />
            </SwiperSlide>
            ))}
        </Swiper>
    </div>
  )
}
