// Theme tokens (colors, typography, spacing, radius)
// Concepto visto en clase: StyleSheet y diseño modular

export const colors = {
  background: '#F6F8FC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  primary: '#E11D48', // Poké Red
  primaryLight: '#FFE4E6',
  accent: '#2563EB',
  white: '#FFFFFF',
  cardShadow: '#0F172A',
  statBarBg: '#E2E8F0',
};

// Pokémon type colors palette
export const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#705595',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

// Translations of types to Spanish
export const typeTranslations = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

// Translations of base stats to Spanish
export const statTranslations = {
  hp: 'PS (HP)',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.text },
  caption: { fontSize: 12, color: colors.textSecondary },
};

export default {
  colors,
  typeColors,
  typeTranslations,
  statTranslations,
  spacing,
  radius,
  typography,
};
