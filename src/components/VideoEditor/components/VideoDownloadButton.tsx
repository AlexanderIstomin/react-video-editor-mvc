import { Button, ButtonProps, Tooltip } from "@mui/material";
import { FileDownload } from "@mui/icons-material";

import { useAppContext } from "../../../hooks/useAppContext";
import { useCallback } from "react";

const VideoDownloadButton: React.FC<ButtonProps> = ({ ...buttonProps }) => {
  const { isProcessing, videoRef } = useAppContext();

  const handleDownload = useCallback(() => {
    if (!videoRef || !videoRef.src) {
      console.error("No video source found!");
      return;
    }

    // Create a link and set the URL to the video source
    const link = document.createElement("a");
    link.href = videoRef.src;
    link.download = "edited_video.mp4";

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  }, [videoRef]);

  return (
    <Tooltip arrow disableFocusListener placement="top" title="Download video">
      <span>
        {" "}
        <Button
          disabled={isProcessing}
          sx={{
            minWidth: "32px",
          }}
          size="small"
          variant="contained"
          onClick={handleDownload}
        >
          <FileDownload />
        </Button>
      </span>
    </Tooltip>
  );
};

export default VideoDownloadButton;
