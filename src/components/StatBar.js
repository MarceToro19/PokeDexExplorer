// Componente para Barra de Estadística Base
// Concepto visto en clase: Renderizado condicional, anchos proporcionales (máximo 255)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, statTranslations, radius, spacing } from '../theme';

const MAX_BASE_STAT = 255;

export default function StatBar({ statName, baseStat }) {
  const percentage = Math.min(100, Math.round((baseStat / MAX_BASE_STAT) * 100));
  const displayName = statTranslations[statName] || statName;

  // Color de la barra dinámico según el valor
  const getBarColor = (val) => {
    if (val >= 100) return '#10B981'; // Verde fuerte (alto)
    if (val >= 60) return '#3B82F6';  // Azul (medio)
    return '#F59E0B';                 // Ámbar (bajo)
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.statName}>{displayName}</Text>
        <Text style={styles.statValue}>
          {baseStat} <Text style={styles.maxText}>/ {MAX_BASE_STAT}</Text>
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: getBarColor(baseStat),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  maxText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.statBarBg,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
