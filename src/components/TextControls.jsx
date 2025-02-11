import React from 'react';

function TextControls({ onTextChange, onAddText, textSettings, onSettingsChange, canvas }) {
  const fonts = [
    'Super Funky',
    'Raster Forge',
    'Bitewise',
    'Arial',
    'Impact',
    'Comic Sans MS',
    'Times New Roman',
    'Helvetica',
    'Permanent Marker',
    'Bangers',
    'Press Start 2P',
    'Anton',
    'Pacifico'
  ];

  const colors = [
    'white',
    'black',
    'red',
    'blue',
    'green',
    'yellow'
  ];

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow w-full max-w-[300px]">

      <div 
        className="p-4 border rounded min-h-[60px] text-center break-words"
        style={{
          fontFamily: textSettings.fontFamily,
          fontSize: `${textSettings.fontSize}px`,
          color: textSettings.color,
          backgroundColor: '#cccccc',
          textShadow: textSettings.color === 'white' ? '1px 1px 0 black' : 'none'
        }}
      >
        {textSettings.text || 'Preview Text'}
      </div>

      <div>
        <textarea
          onChange={(e) => {
            // Deselect any selected object first
            if (canvas) {
              canvas.discardActiveObject().renderAll();
            }
            // Then update the text
            onTextChange(e.target.value);
            onSettingsChange('text', e.target.value);
          }}
          value={textSettings.text || ''}
          placeholder="Enter text"
          className="w-full p-2 border rounded resize-y min-h-[60px] max-h-[120px] overflow-y-auto"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Font</label>
        <select 
          className="mt-1 block w-full p-2 border rounded"
          onChange={(e) => onSettingsChange('fontFamily', e.target.value)}
          value={textSettings.fontFamily}
        >
          {fonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Font Size</label>
        <input
          type="range"
          min="12"
          max="72"
          value={textSettings.fontSize}
          onChange={(e) => onSettingsChange('fontSize', e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-500 text-center">{textSettings.fontSize}px</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="grid grid-cols-6 gap-2 mt-1">
          {colors.map(color => (
            <div
              key={color}
              onClick={() => onSettingsChange('color', color)}
              className={`w-8 h-8 rounded cursor-pointer ${
                textSettings.color === color ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color, border: '1px solid #ddd' }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onAddText}
        className="w-full bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
      >
        Add Text
      </button>
    </div>
  );
}

export default TextControls; 