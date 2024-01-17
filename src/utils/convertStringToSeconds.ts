export default function convertToSeconds(timeString: string): number {
    const parts = timeString.split(':').map(part => Number(part.trim()));
  
    if (parts.some(part => isNaN(part) || part < 0)) {
      return 0; // Return 0 for invalid or negative numbers
    }
  
    let minutes = 0;
    let seconds = 0;
  
    if (parts.length === 1) {
      minutes = parts[0];
    } else if (parts.length === 2) {
      minutes = parts[0];
      seconds = parts[1];
    } else {
      return 0; // Return 0 for more than two parts
    }
  
    // Convert excess seconds into minutes
    minutes += Math.floor(seconds / 60);
    seconds %= 60;
  
    return minutes * 60 + seconds;
  }
  
  