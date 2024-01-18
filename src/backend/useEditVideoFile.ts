import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useCallback, useRef, useState } from "react";

import { useAppContext } from "../hooks/useAppContext";

const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export default function useEditVideoFile() {
  const { videoRef, setIsProcessing } = useAppContext();

  const [progress, setProgress] = useState(0);

  const ffmpegRef = useRef(new FFmpeg());

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(+progress.toFixed(2) * 100);
    });

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${BASE_URL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const cutVideo = useCallback(
    async (operations: Array<[number, number]>) => {
      const ffmpeg = ffmpegRef.current;

      if (!videoRef) {
        return false;
      }

      setIsProcessing(true);

      if (!ffmpeg.loaded) {
        await loadFFmpeg();
      }

      if (!videoRef.src) {
        setIsProcessing(false);
        return false;
      }

      const videoSrc = await fetch(videoRef.src);
      const videoBlob = await videoSrc.blob();

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      // Cut each segment and store the output filenames
      const queue = operations.map(async ([startPos, endPos], index) => {
        const outputSegment = `segment_${index}.mp4`;
        const duration = (endPos - startPos).toString();
        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-ss",
          startPos.toString(),
          "-t",
          duration,
          "-c",
          "copy",
          outputSegment,
        ]);
        return outputSegment;
      });

      const segmentFiles = await Promise.all(queue);

      // Create a file listing all the segments
      const fileList = "fileList.txt";

      const fileListContent = segmentFiles
        .map((file) => `file '${file}'`)
        .join("\n");

      await ffmpeg.writeFile(
        fileList,
        new TextEncoder().encode(fileListContent)
      );

      // Concatenate all the segments
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        fileList,
        "-c",
        "copy",
        "output.mp4",
      ]);

      const data = (await ffmpeg.readFile("output.mp4")) as Uint8Array;

      const blob = new Blob([data.buffer], { type: "video/mp4" });

      setIsProcessing(false);

      return URL.createObjectURL(blob);
    },
    [setIsProcessing, videoRef]
  );

  const overlayImageOnVideo = useCallback(
    async (image: string) => {
      const ffmpeg = ffmpegRef.current;

      if (!videoRef) {
        return false;
      }

      setIsProcessing(true);

      if (!ffmpeg.loaded) {
        await loadFFmpeg();
      }

      if (!videoRef.src) {
        setIsProcessing(false);
        return false;
      }

      const videoSrc = await fetch(videoRef.src);
      const videoBlob = await videoSrc.blob();

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      const imageSrc = await fetch(image);
      const imageBlob = await imageSrc.blob();

      await ffmpeg.writeFile("logo.png", await fetchFile(imageBlob));

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-i",
        "logo.png",
        "-filter_complex",
        "overlay",
        "-preset",
        "ultrafast",
        "-c:a",
        "copy",
        "output.mp4",
      ]);

      const data = (await ffmpeg.readFile("output.mp4")) as Uint8Array;

      const blob = new Blob([data.buffer], { type: "video/mp4" });

      setIsProcessing(false);

      return URL.createObjectURL(blob);
    },
    [setIsProcessing, videoRef]
  );

  const transcodeVideo = useCallback(
    async (video: string) => {
      const ffmpeg = ffmpegRef.current;

      setIsProcessing(true);

      if (!ffmpeg.loaded) {
        await loadFFmpeg();
      }

      const videoSrc = await fetch(video);
      const videoBlob = await videoSrc.blob();

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-c:v",
        "libx264",
        "-profile:v",
        "main",
        "-vf",
        "format=yuv420p",
        "-c:a",
        "aac",
        "-movflags",
        "+faststart",
        "-preset",
        "ultrafast",
        "output.mp4",
      ]);

      const data = (await ffmpeg.readFile("output.mp4")) as Uint8Array;

      const blob = new Blob([data.buffer], { type: "video/mp4" });

      setIsProcessing(false);

      return URL.createObjectURL(blob);
    },
    [setIsProcessing]
  );

  const addIntroOrOutro = useCallback(
    async (additionalVideoSrc: string, type: "intro" | "outro") => {
      const ffmpeg = ffmpegRef.current;

      if (!videoRef) {
        return false;
      }

      setIsProcessing(true);

      if (!ffmpeg.loaded) {
        await loadFFmpeg();
      }

      if (!videoRef.src) {
        setIsProcessing(false);
        return false;
      }

      const videoSrc = await fetch(videoRef.src);
      const videoBlob = await videoSrc.blob();

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      const additionalVideo = await fetchFile(additionalVideoSrc);

      await ffmpeg.writeFile("additionalVideo.mp4", additionalVideo);

      // Concatenate videos
      const outputFileName = "output.mp4";

      if (type === "intro") {
        await ffmpeg.exec([
          "-i",
          "additionalVideo.mp4",
          "-i",
          "input.mp4",
          "-filter_complex",
          "[0:v]fps=fps=30,scale=1280x720,format=yuv420p[v0]; [1:v]fps=fps=30,scale=1280x720,format=yuv420p[v1]; [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]",
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-c:v",
          "libx264",
          "-profile:v",
          "high",
          "-level",
          "4.0",
          "-c:a",
          "aac",
          "-ar",
          "48000",
          "-b:a",
          "192k",
          "-preset",
          "ultrafast",
          "-movflags",
          "+faststart",
          outputFileName,
        ]);
      } else {
        // 'outro'
        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-i",
          "additionalVideo.mp4",
          "-filter_complex",
          "[0:v]fps=fps=30,scale=1280x720,format=yuv420p[v0]; [1:v]fps=fps=30,scale=1280x720,format=yuv420p[v1]; [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]",
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-c:v",
          "libx264",
          "-profile:v",
          "high",
          "-level",
          "4.0",
          "-c:a",
          "aac",
          "-ar",
          "48000",
          "-b:a",
          "192k",
          "-preset",
          "ultrafast",
          "-movflags",
          "+faststart",
          outputFileName,
        ]);
      }

      const data = (await ffmpeg.readFile("output.mp4")) as Uint8Array;

      const blob = new Blob([data.buffer], { type: "video/mp4" });

      setIsProcessing(false);

      return URL.createObjectURL(blob);
    },
    [setIsProcessing, videoRef]
  );

  return {
    cutVideo,
    overlayImageOnVideo,
    progress,
    transcodeVideo,
    addIntroOrOutro,
  };
}
