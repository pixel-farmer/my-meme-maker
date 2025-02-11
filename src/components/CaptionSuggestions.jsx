import React, { useState } from 'react';

function CaptionSuggestions({ onSelectCaption }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const generateCaption = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'Generate a funny meme caption' }),
      });
      
      const data = await response.json();
      if (data.caption) {
        setSuggestion(data.caption);
      }
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <button
        onClick={generateCaption}
        disabled={loading}
        className="w-full bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb] mb-2"
      >
        {loading ? 'Generating...' : 'Suggest Caption'}
      </button>
      
      {suggestion && (
        <div className="mt-2">
          <p className="text-sm mb-2">{suggestion}</p>
          <button
            onClick={() => onSelectCaption(suggestion)}
            className="w-full bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
          >
            Use This Caption
          </button>
        </div>
      )}
    </div>
  );
}

export default CaptionSuggestions; 