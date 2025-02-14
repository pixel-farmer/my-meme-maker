import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper components
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/navigation'; // Optional: For navigation buttons
import 'swiper/css/pagination'; // Optional: For pagination dots

function MemeTemplates({ onSelectTemplate }) {
  // Import all images from the templates directory with ?url
  const templateFiles = import.meta.glob('/public/templates/*.{jpg,jpeg,png,gif}', {
    query: '?url',
    eager: true
  });

  // Process the files into template objects
  const templates = Object.entries(templateFiles).map(([path]) => {
    const filename = path.split('/').pop();
    return {
      id: filename,
      name: filename
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      url: `/templates/${filename}`
    };
  });

  return (
    <div className="mb-6">
      <Swiper
        spaceBetween={20} // Spacing between slides
        slidesPerView={4} // Number of templates visible at a time
        navigation // Enables navigation buttons
        pagination={{ clickable: true }} // Optional: Dots below the slider
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }} // Adjust slides per view based on screen size
      >
        {templates.map(template => (
          <SwiperSlide key={template.id}>
            <div
              onClick={() => onSelectTemplate(template.url)}
              className="cursor-pointer hover:opacity-75 transition-opacity aspect-square"
            >
              <div className="relative w-full h-full">
                <img
                  src={template.url}
                  alt={template.name}
                  className="absolute inset-0 w-full h-full object-cover rounded"
                />
                <p className="absolute bottom-0 left-0 right-0 text-sm text-center p-1 bg-black bg-opacity-50 text-white rounded-b">
                  {template.name}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MemeTemplates;
