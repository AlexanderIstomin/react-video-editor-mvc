import { Box } from "@mui/system";
import { useCallback } from "react";

type TVideoTranscriptionLoaderProps = {
  onFileLoaded: (file: string) => void;
};
const VideoTranscriptionLoader: React.FC<TVideoTranscriptionLoaderProps> = ({
  onFileLoaded,
}) => {
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onFileLoaded(URL.createObjectURL(event.dataTransfer.files[0]));
      }
    },
    [onFileLoaded]
  );

  const handleClick = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".srt";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const content = await target.files[0].text();
        onFileLoaded(content);
      }
    };
    fileInput.click();
  }, [onFileLoaded]);

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
      Click or Drop a Subtitles (SRT) File Here
    </Box>
  );
};

export default VideoTranscriptionLoader;
