import type TTranscription from "../types/TTranscription";

export default function parseVTT(vttContent: string): TTranscription[] {
  const lines = vttContent.split("\n");

  const subtitles: TTranscription[] = [];

  const timeFormatRegex =
    /(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})/;

  let currentSubtitle: Partial<TTranscription> | null = null;

  for (const line of lines) {
    if (timeFormatRegex.test(line)) {
      const match = line.match(timeFormatRegex);

      if (match) {
        const startTimeHours = parseInt(match[1], 10);
        const startTimeMinutes = parseInt(match[2], 10);
        const startTimeSeconds = parseInt(match[3], 10);
        const startTimeMilliseconds = parseInt(match[4], 10);

        const endTimeHours = parseInt(match[5], 10);
        const endTimeMinutes = parseInt(match[6], 10);
        const endTimeSeconds = parseInt(match[7], 10);
        const endTimeMilliseconds = parseInt(match[8], 10);

        const startTimeInSeconds =
          startTimeHours * 3600 +
          startTimeMinutes * 60 +
          startTimeSeconds +
          startTimeMilliseconds / 1000;

        const endTimeInSeconds =
          endTimeHours * 3600 +
          endTimeMinutes * 60 +
          endTimeSeconds +
          endTimeMilliseconds / 1000;

        currentSubtitle = {
          startTimeInSeconds,
          endTimeInSeconds,
          text: "",
        };
      }
    } else if (currentSubtitle) {
      if (currentSubtitle.text) {
        currentSubtitle.text += "\n" + line.trim();
      } else {
        currentSubtitle.text = line.trim();
      }
    } else if (line.trim() === "") {
      // Ignore empty lines
      continue;
    }
    if (currentSubtitle && line.trim() === "") {
      subtitles.push(currentSubtitle as TTranscription);
      currentSubtitle = null;
    }
  }

  return subtitles;
}
