// Componente de Tarjeta de Pokémon para la cuadrícula
// Concepto visto en clase: Tarjeta reutilizable, Image remota, Pressable con micro-interacción
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { formatPokemonNumber, capitalizeFirstLetter } from '../services/pokeapiService';

export default function PokemonCard({ pokemon, onPress, width }) {
  return (
    <Pressable
      onPress={() => onPress && onPress(pokemon)}
      style={({ pressed }) => [
        styles.card,
        width ? { width } : { flex: 1 },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.header}>
        {/* Número con 3 dígitos (#025) */}
        <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
      </View>

      <View style={styles.imageContainer}>
        {/* Una Image con URL remota necesita width y height explícitos o no se ve */}
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        {/* Nombre con la primera letra en mayúscula */}
        <Text style={styles.name} numberOfLines={1}>
          {capitalizeFirstLetter(pokemon.name)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  number: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  imageContainer: {
    width: '100%',
    height: 105,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  image: {
    width: 95,
    height: 95,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
});
