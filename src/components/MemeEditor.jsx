import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import MemeTemplates from './MemeTemplates';
import TextControls from './TextControls';
import ImageControls from './ImageControls';
import CaptionSuggestions from './CaptionSuggestions';

function MemeEditor() {
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [text, setText] = useState('');
  const [textSettings, setTextSettings] = useState({
    fontFamily: 'Impact',
    fontSize: 40,
    color: 'white'
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('meme-canvas', {
      width: 600,
      height: 600,
    });
  
    canvas.on('selection:created', (e) => {
      console.log('Selected object type:', e.selected[0].type);
      setActiveObject(e.selected[0]);
  
      // Bring all text objects to front
      canvas.getObjects().forEach((obj) => {
        if (obj.type === 'text') {
          obj.bringToFront();
        }
      });
      canvas.renderAll();
    });
  
    canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
      setActiveObject(null);
    });
  
    // Also bring text to front after any object modification
    canvas.on('object:modified', () => {
      canvas.getObjects().forEach((obj) => {
        if (obj.type === 'text') {
          obj.bringToFront();
        }
      });
      canvas.renderAll();
    });
  
    setCanvas(canvas);
  
    const updateCanvasSize = () => {
      //const containerWidth = canvasRef.current.parentElement.offsetWidth;
      //const maxSize = 600; // Max canvas size for larger screens
      //const size = Math.min(containerWidth, maxSize); // Use the smaller value for responsiveness
      const container = canvasRef.current.parentElement;
      const size = container.offsetWidth; // Use the container's width for both width and height
    
      canvas.setWidth(size);
      canvas.setHeight(size); // Keep the canvas square
      canvas.renderAll();
    };
  
    // Adjust canvas size initially and on resize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
  
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', updateCanvasSize); // Clean up resize listener here
    };
  }, []);
  

  const handleImageUpload = (file) => {
    const updateCanvasSize = () => {
      const containerWidth = canvasRef.current.parentElement.offsetWidth; // Get the container's width
      canvas.setWidth(containerWidth);
      canvas.setHeight(containerWidth); // Keep the canvas square
      canvas.renderAll();
    };
  
    // Adjust the canvas size initially and on window resize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
  
    if (typeof file === 'string') {
      // Handle template URL
      fabric.Image.fromURL(
        file,
        (img) => {
          canvas.clear();
          const scaleFactor = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          img.scale(scaleFactor);
          img.crossOrigin = 'anonymous';
          canvas.centerObject(img);
          canvas.add(img);
          canvas.renderAll();
        },
        { crossOrigin: 'anonymous' }
      );
    } else {
      // Handle file upload
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          canvas.clear();
          const scaleFactor = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          img.scale(scaleFactor);
          canvas.centerObject(img);
          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSettings = (setting, value) => {
    setTextSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const addText = () => {
    if (!text) return;
    
    const fabricText = new fabric.Text(text, {
      left: 100,
      top: 100,
      fontSize: parseInt(textSettings.fontSize),
      fontFamily: textSettings.fontFamily,
      fill: textSettings.color,
      stroke: textSettings.color === 'white' ? 'black' : 'white',
      strokeWidth: 1,
    });
    
    canvas.add(fabricText);
    fabricText.bringToFront();
    canvas.renderAll();
  };

  const downloadMeme = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = dataURL;
    link.click();
  };

  const deleteSelectedObject = () => {
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      setActiveObject(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeObject]);

  const handleCaptionSelect = (caption) => {
    setText(caption);
    setTextSettings(prev => ({
      ...prev,
      text: caption
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-0 bg-gray-500">
      <MemeTemplates onSelectTemplate={handleImageUpload} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 min-w-0">
            
          <div className="relative w-full max-w-[600px] mx-auto border border-gray-300 mb-4 relative p-0 bg-black">
            <canvas id="meme-canvas" ref={canvasRef} />
            {activeObject && activeObject.type === 'text' && (
              <button
                onClick={deleteSelectedObject}
                className="absolute top-2 right-2 bg-[#cccccc] text-black px-3 py-1 rounded text-sm hover:bg-[#bbbbbb]"
              >
                Delete Text
              </button>
            )}
            <button
              onClick={() => canvas.discardActiveObject().renderAll()}
              className="absolute top-2 left-2 bg-[#cccccc] text-black px-3 py-1 rounded text-sm hover:bg-[#bbbbbb]"
            >
              Show All
            </button>
          </div>

          <button
            onClick={downloadMeme}
            className="bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
          >
            Download Meme
          </button>
        </div>
        
        <div className="space-y-4 min-w-0">
          {/*  <CaptionSuggestions onSelectCaption={handleCaptionSelect} /> */}

          <div className="p-4 bg-white rounded shadow mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb] text-sm font-semibold"
            >
              Upload Photo
            </label>
          </div>

          <TextControls
            onTextChange={setText}
            onAddText={addText}
            textSettings={textSettings}
            onSettingsChange={handleTextSettings}
            canvas={canvas}
          />
          
          {activeObject && (
            <ImageControls 
              canvas={canvas} 
              activeObject={activeObject} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MemeEditor;