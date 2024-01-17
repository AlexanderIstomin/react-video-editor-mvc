export default function checkIfcanPlayVideo(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const videoElement = document.createElement("video");
    videoElement.addEventListener("canplay", () => {
      resolve(true);
      URL.revokeObjectURL(videoElement.src); // Clean up
    });

    videoElement.addEventListener("error", () => {
      resolve(false);
      URL.revokeObjectURL(videoElement.src); // Clean up
    });

    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.load(); // Load the video file
  });
}
