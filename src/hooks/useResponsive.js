// Responsive hook for screen dimensions and layout calculations
// Adaptado de la base ReservaClaseIngles
import { useWindowDimensions } from 'react-native';

export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Calculamos 2 columnas como pide la guía del taller
  const numColumns = 2;
  const horizontalPadding = isTablet ? 24 : 12;
  const gap = 12;

  // Ancho exacto de cada tarjeta para 2 columnas
  const cardWidth = (width - horizontalPadding * 2 - gap) / numColumns;

  return {
    width,
    height,
    isTablet,
    isLandscape,
    numColumns,
    horizontalPadding,
    gap,
    cardWidth,
  };
}
