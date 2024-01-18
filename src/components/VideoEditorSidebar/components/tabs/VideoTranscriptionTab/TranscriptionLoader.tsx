import { useCallback } from "react";
import { Box } from "@mui/system";

import { useAppContext } from "../../../../../hooks/useAppContext";
import parseVTT from "../../../../../utils/parseVTT";
import parseSRT from "../../../../../utils/parseSRT";

const VideoTranscriptionLoader: React.FC = () => {
  const { setSubtitles } = useAppContext();

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const loadSubtitles = useCallback(
    (content: string, type: string) => {
      let subtitles = [];

      if (type === "text/vtt") {
        subtitles = parseVTT(content);
      } else {
        subtitles = parseSRT(content);
      }

      setSubtitles(subtitles);
    },
    [setSubtitles]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        loadSubtitles(URL.createObjectURL(file), file.type);
      }
    },
    [loadSubtitles]
  );

  const handleClick = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".srt,.vtt";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const content = await target.files[0].text();
        loadSubtitles(content, target.files[0].type);
      }
    };
    fileInput.click();
  }, [loadSubtitles]);

  return (
    <Box
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        background: "white",
      }}
    >
      Click or Drop a Subtitles (SRT, VTT) File Here
    </Box>
  );
};

export default VideoTranscriptionLoader;
