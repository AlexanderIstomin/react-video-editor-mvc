import type TTranscription from "../types/TTranscription";

export default function parseSRT(content: string): TTranscription[] {
  const subtitles: TTranscription[] = [];
  const subtitleBlocks = content.match(
    /^\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n.*?(?=\n\n|\n*$)/gms
  );

  if (!subtitleBlocks) return [];

  let previousSubtitle: TTranscription | null = null;

  subtitleBlocks.forEach((block) => {
    const lines = block.split("\n");
    const timecodeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/
    );

    if (timecodeMatch) {
      const startTimeInSeconds = Math.ceil(
        convertTimeToSeconds(timecodeMatch[1].replace(",", "."))
      );

      const endTimeInSeconds = Math.floor(
        convertTimeToSeconds(timecodeMatch[2].replace(",", "."))
      );

      const text = lines.slice(2).join(" ").trim();

      if (
        previousSubtitle &&
        endTimeInSeconds - previousSubtitle.startTimeInSeconds < 10
      ) {
        // Merge with previous subtitle
        previousSubtitle.endTimeInSeconds = endTimeInSeconds;
        previousSubtitle.text += " " + cleanText(text);
      } else {
        // Create a new subtitle and add it to the array
        previousSubtitle = {
          startTimeInSeconds,
          endTimeInSeconds,
          text: cleanText(text),
        };
        subtitles.push(previousSubtitle);
      }
    }
  });

  return subtitles;
}

function convertTimeToSeconds(time: string): number {
  const [hours = 0, minutes = 0, seconds = 0] = time.split(":").map(Number);
  const [sec = 0, milli = 0] = seconds.toString().split(".").map(Number);
  return hours * 3600 + minutes * 60 + sec + milli / 1000;
}

function cleanText(text: string): string {
  return text.replace(/<[^>]+>/g, "").trim();
}
