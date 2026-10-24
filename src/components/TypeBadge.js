// Componente de Badge/Distintivo de Tipo Pokémon
// Concepto visto en clase: Componentes modulares, StyleSheet y paleta de colores dinámica
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typeColors, typeTranslations, radius, spacing } from '../theme';

export default function TypeBadge({ typeName, size = 'medium' }) {
  const normalizedType = typeName ? typeName.toLowerCase() : 'normal';
  const backgroundColor = typeColors[normalizedType] || '#777777';
  const label = typeTranslations[normalizedType] || typeName;

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        isSmall ? styles.badgeSmall : styles.badgeMedium,
      ]}
    >
      <Text style={[styles.text, isSmall ? styles.textSmall : styles.textMedium]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeMedium: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginHorizontal: 4,
    minWidth: 80,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 13,
  },
});
