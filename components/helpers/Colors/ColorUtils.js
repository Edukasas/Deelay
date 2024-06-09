export const generateCategoryColors = (length) => {
  const predefinedColors = [
    '#354171',
    '#5D4C7E',
    '#4A5873',
    '#7C8AC0',
    '#9FA9E6',
    '#BCC4FF',
    '#393C43',
    '#3C324B',
    '#596080',
    '#A8B3D7',
    '#C3CCE6',
    '#D6D9FF',
    '#94A3E4',
    '#BBC4EC',
    '#494066',
    '#6F7898',
    '#B9C1E2',
    '#D0D4FF',
    '#DDE1FF',
    '#2E2441',
  ];

  const newCategoryColors = [];

  for (let i = 0; i < length; i++) {
    const color = i < predefinedColors.length ? predefinedColors[i] : generateRandomColor();
    newCategoryColors.push(color);
  }

  return newCategoryColors;
};

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};
