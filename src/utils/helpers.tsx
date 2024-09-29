import { Gallery } from "./interface";
import { v4 as uuidv4 } from "uuid";

/**
 * Random prompt for home page.
 * @returns string
 */
export function getRandomPrompt() {
  const phrases = [
    "What would you like to imagine today?",
    "What type of image would you like to create?",
    "Tell me, what do you wish to design today?",
    "What creation inspires you today?",
    "Do you have an image idea in mind?",
    "What is your artistic project for the day?",
    "What do you want to explore visually?",
    "Share your vision for a new creation!",
    "What story would you like to see illustrated?",
    "What elements would you like to combine in your image?",
    "How do you envision your next artwork?",
    "Do you have a theme in mind for your creation?",
    "What do you want to highlight in your image?",
    "What atmosphere do you want to create today?",
    "What details would you like to include in your design?",
  ];

  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}

/**
 * Format a date string to a human-readable format
 * @param dateString string
 * @returns string
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-EN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

/**
 * Download generated images
 * @param showImg Gallery
 */
export const handleDownload = (showImg: Gallery) => {
  if (!showImg) return;

  const imageUrl = showImg.uri.startsWith("http")
    ? showImg.uri
    : process.env.NEXT_PUBLIC_APP_URL + "/images/" + showImg.uri;

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = showImg.uri;
  link.target = "_blank";
  link.style.display = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate UUID string
 * @returns string
 */
export function generateUUID() {
  const uniqueId = uuidv4();
  return `${uniqueId}`;
}

export function APP_URL() {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_APP_URL_LOCAL;
  } else {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
}

export function APP_ENDPOINT() {
  return APP_URL() + "/api";
}
