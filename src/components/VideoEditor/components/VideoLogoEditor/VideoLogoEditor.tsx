import { useAppContext } from "../../../../hooks/useAppContext";
import VideoCanvasOverlay from "./VideoCanvasOverlay";

const VideoLogoEditor: React.FC = () => {
  const { isLogoEditorOpen } = useAppContext();

  if (!isLogoEditorOpen) {
    return null;
  }

  return <VideoCanvasOverlay />;
};

export default VideoLogoEditor;
