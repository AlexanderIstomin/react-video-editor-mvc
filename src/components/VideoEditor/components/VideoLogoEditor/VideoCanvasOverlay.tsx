import React, { useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";

import { useAppContext } from "../../../../hooks/useAppContext";
import { Box, Button } from "@mui/material";
import useEditVideoFile from "../../../../backend/useEditVideoFile";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

const VideoCanvasOverlay: React.FC = () => {
  const { videoRef, isProcessing, logoEditorToggle } = useAppContext();
  const { overlayImageOnVideo, progress } = useEditVideoFile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  // Handle Delete key to remove selected object
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      if (fabricCanvas.current) {
        const activeObject = fabricCanvas.current.getActiveObject();
        if (activeObject) {
          fabricCanvas.current.remove(activeObject);
        }
      }
    }
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const addImageToCanvas = useCallback((data: string) => {
    if (typeof data === "string" && fabricCanvas.current) {
      fabric.Image.fromURL(data, (img) => {
        const canvas = fabricCanvas.current;

        if (img.width && img.height && canvas?.width && canvas.height) {
          const scaleX = canvas.width / img.width / 2;
          const scaleY = canvas.height / img.height / 2;
          const scale = Math.min(scaleX, scaleY);

          if (scale < 1) {
            img.scale(scale);
          }

          canvas.add(img);
          canvas.renderAll();
        }
      });
    }
  }, []);

  const handleClick = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = function (fileEvent: ProgressEvent<FileReader>) {
          const data = fileEvent.target?.result as string;
          addImageToCanvas(data);
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }, [addImageToCanvas]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onload = function (fileEvent: ProgressEvent<FileReader>) {
          const data = fileEvent.target?.result as string;
          addImageToCanvas(data);
        };

        reader.readAsDataURL(file);
      }
    },
    [addImageToCanvas]
  );

  const handleExportCanvas = useCallback(async () => {
    if (!fabricCanvas.current) {
      return;
    }

    fabricCanvas.current.discardActiveObject().renderAll();
    fabricCanvas.current.getElement().style.pointerEvents = "none";

    const imageUrl = fabricCanvas.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const resultBlobUrl = await overlayImageOnVideo(imageUrl);

    if (!resultBlobUrl || !videoRef) {
      return;
    }

    logoEditorToggle();

    videoRef.src = resultBlobUrl;
  }, [logoEditorToggle, overlayImageOnVideo, videoRef]);

  useEffect(() => {
    // Set up Fabric.js canvas
    if (canvasRef.current && !fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
      });
    }

    // Update canvas size to match video size
    const updateCanvasSize = () => {
      if (videoRef && fabricCanvas.current) {
        fabricCanvas.current.setDimensions({
          width: videoRef.offsetWidth,
          height: videoRef.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, videoRef]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-16px",
          display: "flex",
          width: "100%",
          gap: "8px",
          "& > button": {
            textTransform: "none",
            padding: "4px",
            minHeight: 0,
            lineHeight: "20px",
          },
        }}
      >
        <Button
          disabled={isProcessing}
          size="small"
          variant="contained"
          onClick={handleClick}
        >
          Add Logo
        </Button>
        <Button
          disabled={isProcessing}
          size="small"
          variant="contained"
          onClick={handleExportCanvas}
        >
          Apply Logo
        </Button>
        {isProcessing && <LinearProgressWithLabel value={progress} />}
      </Box>
    </Box>
  );
};

export default VideoCanvasOverlay;
