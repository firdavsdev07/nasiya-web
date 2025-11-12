const urlImage = import.meta.env.VITE_SERVER_URL;

export function ImageUrl(url: string) {
  return urlImage + url;
}
