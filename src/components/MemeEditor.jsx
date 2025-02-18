import { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import MemeTemplates from "./MemeTemplates";
import TextControls from "./TextControls";
import { FiSettings } from "react-icons/fi"; // For gear icon

function MemeEditor() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeObject, setActiveObject] = useState(null);
  const activeObjectRef = useRef(null); // New ref for active object
  const [textSettings, setTextSettings] = useState({
    fontFamily: "Impact",
    fontSize: 40,
    color: "white",
    strokeColor: "black",
    textEffect: "none", // Options: 'shadow', 'outline', 'none'
    text: "",
  });

  // Reintroduce state for toggling the font style pop-up:
  const [showSettings, setShowSettings] = useState(false);
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  useEffect(() => {
    activeObjectRef.current = activeObject;
  }, [activeObject]);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("meme-canvas", {
      width: 598,
      height: 598,
    });

    fabricCanvas.on("selection:created", (e) => {
      setActiveObject(e.selected[0]);
    });

    fabricCanvas.on("selection:cleared", () => {
      setActiveObject(null);
    });

    canvasRef.current = fabricCanvas;

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const size = containerRef.current.offsetWidth;
        fabricCanvas.setWidth(size);
        fabricCanvas.setHeight(size);
        fabricCanvas.renderAll();
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    // Add event listener for deleting objects
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const currentActive = activeObjectRef.current;
        if (canvasRef.current && currentActive) {
          canvasRef.current.remove(currentActive);
          setActiveObject(null);
          canvasRef.current.renderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Removed activeObject from dependency arr

  const handleImageUpload = (file) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof file === "string") {
      fabric.Image.fromURL(file, (img) => {
        const scaleFactor = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        img.scale(scaleFactor);
        img.crossOrigin = "anonymous";
        canvas.setBackgroundImage(
          img,
          canvas.renderAll.bind(canvas),
          { originX: "left", originY: "top" }
        );
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          const scaleFactor = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          img.scale(scaleFactor);
          canvas.setBackgroundImage(
            img,
            canvas.renderAll.bind(canvas),
            { originX: "left", originY: "top" }
          );
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onAddText = () => {
    const canvas = canvasRef.current;
    if (canvas && textSettings.text) {
      const newText = new fabric.Textbox(textSettings.text, {
        left: 100,
        top: 100,
        fontSize: textSettings.fontSize,
        fontFamily: textSettings.fontFamily,
        fill: textSettings.color,
        stroke: textSettings.strokeColor,
        strokeWidth: textSettings.textEffect === "outline" ? 2 : 0,
        shadow:
          textSettings.textEffect === "shadow"
            ? "2px 2px 5px rgba(0,0,0,0.5)"
            : "",
      });
      canvas.add(newText);
      canvas.setActiveObject(newText);
      canvas.renderAll();
    }
  };


  const handleDownloadMeme = () => {
    if (canvasRef.current) {
      const fabricCanvas = canvasRef.current;
      const dataURL = fabricCanvas.toDataURL({ format: "png", quality: 1 });
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = dataURL;
      link.click();
    }
  };

  const handleSettingsChange = (key, value) => {
    setTextSettings((prev) => {
      const newSettings = { ...prev, [key]: value };

          // Update the active text object if it exists
    const canvas = canvasRef.current;
    const active = canvas && canvas.getActiveObject();
    if (active && active.type === "textbox") {
      switch (key) {
        case "fontFamily":
          active.set("fontFamily", value);
          break;
        case "fontSize":
          active.set("fontSize", parseInt(value, 10));
          break;
        case "color":
          active.set("fill", value);
          break;
        case "strokeColor":
          active.set("stroke", value);
          break;
        case "textEffect":
          if (value === "outline") {
            active.set("strokeWidth", 2);
          } else {
            active.set("strokeWidth", 0);
          }
          if (value === "shadow") {
            active.set("shadow", "2px 2px 5px rgba(0,0,0,0.5)");
          } else {
            active.set("shadow", "");
          }
          break;
        default:
          break;
      }
      canvas.renderAll();
    }
    return newSettings;
  });
};

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4 bg-gray-500">
    {/* Template slider at the top */}
    <MemeTemplates onSelectTemplate={handleImageUpload} />
    
    <div className="flex flex-col md:flex-row gap-4">
      {/* Canvas Section */}
      <div className="flex-grow">
        <div
          ref={containerRef}
          className="relative w-full max-w-[600px] mx-auto border border-gray-300 bg-black"
        >
          <canvas id="meme-canvas" />
        </div>
      </div>
      
      {/* Right Column: Photo Uploader and Text Controls */}
      <div className="w-full md:w-[400px]">
        {/* Photo Uploader */}
        <div className="p-4 bg-white rounded shadow mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e.target.files[0])
            }
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer inline-block bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
          >
            Upload Photo
          </label>
        </div>
        {/* Text Controls */}
        <TextControls
  onAddText={onAddText}
  textSettings={textSettings}
  onSettingsChange={handleSettingsChange}
  canvas={canvasRef.current}
  showSettings={showSettings}
  toggleSettings={toggleSettings}
/>
      </div>
    </div>

      <button
        onClick={handleDownloadMeme}
        className="bg-[#cccccc] text-black px-4 py-2 rounded hover:bg-[#bbbbbb]"
      >
        Download Meme
      </button>
    </div>
  );
}

export default MemeEditor;
