// Color mapping for skin tones, hair colors, and eye colors
export const skinColorMapping = {
  'Fair': '#F5DEB3',
  'Light': '#FDBCB4',
  'Medium': '#E08E79',
  'Tan': '#D2691E',
  'Brown': '#8B4513',
  'Deep': '#5D4037'
};

export const hairColorMapping = {
  'Black': '#2C1810',
  'Dark Brown': '#3C2415',
  'Light Brown ': '#8B4513',
  'Blonde': '#F4E4BC'
};

export const eyeColorMapping = {
  'blue': '#87CEEB',
  'Dark Brown': '#8B4513',
  'Light Brown': '#D2691E',
  'Green': '#90EE90',
  'Black': '#2C1810'
};

// Helper function to get color for a given name
export const getSkinColor = (skinColorName) => {
  return skinColorMapping[skinColorName] || '#E0E0E0';
};

export const getHairColor = (hairColorName) => {
  return hairColorMapping[hairColorName] || '#E0E0E0';
};

export const getEyeColor = (eyeColorName) => {
  return eyeColorMapping[eyeColorName] || '#E0E0E0';
};
