import React from 'react';
import './Popular.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper core styles
import banner1 from '../Assets/banner1.avif';
import banner2 from '../Assets/banner2.jpg';
import banner3 from '../Assets/banner3.avif';

const Popular = () => {
  return (
    <div className="popular">
      <h1>Popular Products</h1>
      <hr />

      {/* Swiping Banner */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}  // Ensures the banner loops
      >
        <SwiperSlide>
          <img src={banner1} alt="Banner 1" className="banner-img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2} alt="Banner 2" className="banner-img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner3} alt="Banner 3" className="banner-img" />
        </SwiperSlide>
      </Swiper>

      {/* Popular Items */}
    </div>
  );
};

export default Popular;
