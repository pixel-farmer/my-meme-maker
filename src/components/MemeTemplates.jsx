import React from 'react';

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
    <div className="grid grid-cols-6 gap-4 mb-6">
      {templates.map(template => (
        <div 
          key={template.id}
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
      ))}
    </div>
  );
}

export default MemeTemplates; 