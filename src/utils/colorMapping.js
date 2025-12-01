// Color mapping for skin tones, hair colors, and eye colors
// Using normalized keys (lowercase, trimmed) for case-insensitive matching
const skinColorMapping = {
  // Original
  'fair': '#F5DEB3',
  'light': '#FDBCB4',
  'medium': '#E08E79',
  'tan': '#D2691E',
  'brown': '#8B4513',
  'deep': '#5D4037',
  'dark': '#5D4037',
  'olive': '#C9B037',

  // Additional natural tone variations
  'very fair': '#FFEBD6',
  'porcelain': '#FFF1E0',
  'ivory': '#F6E2C5',
  'beige': '#E7C9A9',

  'light medium': '#D9A27B',
  'medium tan': '#C97A4C',
  'golden tan': '#C68642',

  'light brown': '#A56B46',
  'medium brown': '#7B4A2F',
  'dark brown': '#4B2E21',

  'deep brown': '#3B241A',
  'espresso': '#2E1B15',
  'mahogany': '#3D1F17',

  // Undertone-based shades (commonly used in design)
  'warm fair': '#F6D9B8',
  'cool fair': '#F2D7CF',
  'warm medium': '#CC8C62',
  'cool medium': '#BC7F6A',
  'warm dark': '#5A3B2E',
  'cool dark': '#523A3A',

  // Olive variations
  'light olive': '#D5C195',
  'medium olive': '#BBA36A',
  'deep olive': '#8F7C3A'
};


const hairColorMapping = {
  // Your original colors
  'black': '#2C1810',
  'dark brown': '#3C2415',
  'light brown': '#8B4513',
  'brown': '#654321',
  'blonde': '#F4E4BC',
  'green': '#228B22',
  'red': '#DC143C',

  // Additional natural hair colors
  'dark blonde': '#D2B48C',
  'dirty blonde': '#C8B186',
  'platinum blonde': '#FFF5D7',
  'golden blonde': '#F7E29E',

  'auburn': '#A52A2A',
  'ginger': '#D24D2B',
  'copper': '#B87333',

  'chestnut': '#7B3F00',
  'mahogany': '#4A212A',

  'light black': '#3B302A',

  'gray': '#808080',
  'grey': '#808080',
  'silver': '#C0C0C0',
  'white': '#FFFFFF',

  // Rare natural tones
  'strawberry blonde': '#FFCC99',
  'ash blonde': '#E3D9C6',
  'ash brown': '#A89F8D',
  'smokey brown': '#7E6A56',

  // Fantasy / stylized colors (optional)
  'blue': '#1E90FF',
  'pink': '#FF69B4',
  'purple': '#800080',
  'orange': '#FFA500',
  'turquoise': '#40E0D0',
  'teal': '#008080',
  'lavender': '#B57EDC',
  'magenta': '#FF00FF',
  'yellow': '#FFD700'
};


const eyeColorMapping = {
  'blue': '#87CEEB',
  'dark brown': '#8B4513',
  'light brown': '#D2691E',
  'green': '#90EE90',
  'black': '#2C1810',
  'gray': '#808080',
  'grey': '#808080',
  'red': '#DC143C',
  'yellow': '#FFD700',

  // Additional common eye colors
  'hazel': '#8E7618',
  'amber': '#BF8A30',
  'violet': '#8F00FF',
  'violet-blue': '#7F00FF',
  'golden': '#DAA520',

  // Rare / descriptive variations
  'blue-gray': '#6699CC',
  'green-gray': '#8BAE86',
  'brown-gray': '#7B6A4D',
  'forest green': '#228B22',
  'ice blue': '#B0E0FF',
  'dark blue': '#00008B',

  // Fantasy / stylized colors (optional)
  'purple': '#800080',
  'orange': '#FFA500',
  'white': '#FFFFFF',

  // Heterochromia variants
  'heterochromia blue-brown': ['#87CEEB', '#8B4513'],
  'heterochromia green-brown': ['#90EE90', '#8B4513'],
  'heterochromia blue-green': ['#87CEEB', '#90EE90']
};


// Helper function to normalize color name (trim, lowercase)
const normalizeColorName = (colorName) => {
  if (!colorName) return '';
  return colorName.trim().toLowerCase();
};

// Helper function to get color for a given name (case-insensitive)
export const getSkinColor = (skinColorName) => {
  if (!skinColorName) return '#E0E0E0';
  const normalized = normalizeColorName(skinColorName);
  return skinColorMapping[normalized] || '#E0E0E0';
};

export const getHairColor = (hairColorName) => {
  if (!hairColorName) return '#E0E0E0';
  const normalized = normalizeColorName(hairColorName);
  return hairColorMapping[normalized] || '#E0E0E0';
};

export const getEyeColor = (eyeColorName) => {
  if (!eyeColorName) return '#E0E0E0';
  const normalized = normalizeColorName(eyeColorName);
  return eyeColorMapping[normalized] || '#E0E0E0';
};
