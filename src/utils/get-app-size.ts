// I hope we never get a terrabyte IPA 💀
const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

export default (size: number) => {
  let i = 0;
  let currentSize = size;

  while (currentSize > 1000) {
    currentSize /= 1000;
    i += 1;
  }

  return `${currentSize.toFixed(1)} ${sizes[i]}`
};
