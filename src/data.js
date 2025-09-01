export const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const value_converter = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value.toString();
  }
};
