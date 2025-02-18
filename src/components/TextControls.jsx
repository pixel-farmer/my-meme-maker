import React from 'react';
import { FiSettings } from 'react-icons/fi';

function TextControls({ onAddText, textSettings, onSettingsChange, toggleSettings, showSettings, addOrUpdateText, canvas }) {
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

  return (
    <div className="max-w-6xl mx-auto p-0 bg-gray-500">
      <div className="space-y-0 min-w-0 relative">
        {[1, 2].map((row, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white p-4 shadow relative"
          >
            <input
              type="text"
              placeholder={`Text Row ${row}`}
              className="border rounded px-3 py-2 flex-grow text-sm"
              onChange={(e) => onSettingsChange("text", e.target.value)}
            />
            <input
              type="color"
              value={textSettings.color}
              onChange={(e) => onSettingsChange("color", e.target.value)}
              className="border rounded h-8 w-8"
            />
            <input
              type="color"
              value={textSettings.strokeColor}
              onChange={(e) => onSettingsChange("strokeColor", e.target.value)}
              className="border rounded h-8 w-8"
            />
            <button onClick={toggleSettings} className="p-2">
              <FiSettings className="text-xl" />
            </button>
          </div>
        ))}

         {/* Settings Panel */}
         {showSettings && ( // Only show when showSettings is true
          <div className="absolute left-0 top-14 bg-white border shadow rounded p-4 z-20">
            <label className="block mb-2 text-sm">Font Family:</label>
            <select
              onChange={(e) => onSettingsChange("fontFamily", e.target.value)}
              value={textSettings.fontFamily}
              className="block w-full border rounded p-2 mb-4"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              {["shadow", "outline", "none"].map((effect) => (
                <button
                  key={effect}
                  type="button"
                  className={`check-wrap radio ${
                    textSettings.textEffect === effect ? "checked" : ""
                  }`}
                  onClick={() => onSettingsChange("textEffect", effect)}
                >
                  <span className="check-text capitalize">{effect}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onAddText}
          className="w-full bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
        >
          Add Text
        </button>
      </div>
    </div>
  );
}

export default TextControls;