export type imagesDB =
  | "hug"
  | "kiss"
  | "pat"
  | "happy"
  | "sad"
  | "angry"
  | "love"
  | "hate"
  | "confused"
  | "bored"
  | "scared"
  | "fucks"
  | "licks"
  | "sucks";

export const imagesDB = [
  "hug",
  "kiss",
  "pat",
  "happy",
  "sad",
  "angry",
  "love",
  "hate",
  "confused",
  "bored",
  "scared",
  "fucks",
  "licks",
  "sucks",
];

export interface imageAPI {
  id: string
  title: string
  url_viewer: string
  url: string
  display_url: string
  size: number
  time: string
  expiration: string
  image: file
  thumb: file
  delete_url: string
}

export interface file {
  filename: string
  name: string
  mime: string
  extension: string
  url: string
}

export interface deletedImageData {
  name: string
  category: string
  filteredData: string[]
  sizeOfArray: number
}


