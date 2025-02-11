import { useState } from 'react';

function ImageControls({ canvas, activeObject }) {
  const [rotation, setRotation] = useState(0);

  const handleRotation = (e) => {
    const newRotation = parseInt(e.target.value);
    setRotation(newRotation);
    
    if (activeObject && activeObject.type === 'image') {
      activeObject.rotate(newRotation);
      canvas.renderAll();
    }
  };

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    
    if (activeObject && activeObject.type === 'image') {
      activeObject.scale(scale);
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rotation: {rotation}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={handleRotation}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scale
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          defaultValue="1"
          onChange={handleScale}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default ImageControls;