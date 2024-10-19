import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Avatar } from '@mantine/core';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FoundersCarousel.scss';

interface Founder {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface FoundersCarouselProps {
  founders: Founder[];
  setActiveFounder: (founder: Founder) => void;
}

const FoundersCarousel: React.FC<FoundersCarouselProps> = ({ founders, setActiveFounder }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={3.5}
      navigation
      pagination={{ clickable: true }}
      className="founders-carousel"
    >
      {founders.map((founder) => (
        <SwiperSlide key={founder.id} onClick={() => setActiveFounder(founder)}>
          <Avatar
            src={founder.avatar}
            alt={founder.name}
            size={100}
            className="founder-avatar"
          />
          <div className="founder-info">
            <h3>{founder.name}</h3>
            <p>{founder.role}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FoundersCarousel;
