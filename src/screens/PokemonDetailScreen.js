// Pantalla de Ficha de Detalle de Pokémon
// Concepto visto en clase: useEffect con dependencias controladas, fetch con async/await, Image remota, componentes core
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, spacing, typography, typeColors } from '../theme';
import {
  fetchPokemonDetail,
  formatPokemonNumber,
  capitalizeFirstLetter,
} from '../services/pokeapiService';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import UIState from '../components/UIState';

export default function PokemonDetailScreen({
  pokemonIdentifier, // ID o nombre recibido desde la lista
  onBack,
}) {
  // Concepto visto en clase: useState para controlar estados de interfaz
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Concepto visto en clase: useEffect con dependencias bien controladas para evitar ciclos infinitos
  useEffect(() => {
    let isMounted = true;

    async function loadPokemonData() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPokemonDetail(pokemonIdentifier);
        
        if (!isMounted) return;

        if (!data) {
          setError('El Pokémon solicitado no fue encontrado.');
        } else {
          setPokemon(data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'No se pudo cargar la información del Pokémon.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (pokemonIdentifier) {
      loadPokemonData();
    }

    return () => {
      isMounted = false;
    };
  }, [pokemonIdentifier]);

  // Estado: Cargando
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Volver a la lista</Text>
          </Pressable>
        </View>
        <UIState type="loading" message="Cargando ficha del Pokémon..." />
      </View>
    );
  }

  // Estado: Error
  if (error || !pokemon) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Volver a la lista</Text>
          </Pressable>
        </View>
        <UIState
          type="error"
          title="Error al cargar Pokémon"
          message={error || 'No se pudo obtener el detalle.'}
          onRetry={() => {
            setLoading(true);
            setError(null);
            fetchPokemonDetail(pokemonIdentifier)
              .then((data) => {
                if (data) setPokemon(data);
                else setError('El Pokémon no existe.');
              })
              .catch((err) => setError(err.message))
              .finally(() => setLoading(false));
          }}
        />
      </View>
    );
  }

  // Color de fondo temático basado en el tipo primario
  const primaryType = pokemon.types[0] || 'normal';
  const mainTypeColor = typeColors[primaryType] || colors.primary;

  // Estado: Éxito (Vista de Detalle)
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Botón: "Volver a la lista" */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </Pressable>
      </View>

      {/* Cabecera con número, nombre e imagen grande */}
      <View style={[styles.cardHeader, { backgroundColor: mainTypeColor }]}>
        <View style={styles.badgeRow}>
          <Text style={styles.pokemonNumber}>
            {formatPokemonNumber(pokemon.id)}
          </Text>
        </View>

        <Text style={styles.pokemonName}>
          {capitalizeFirstLetter(pokemon.name)}
        </Text>

        {/* Imagen grande del Pokémon */}
        {/* Una Image con URL remota necesita width y height explícitos o no se ve */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: pokemon.image }}
            style={styles.largeImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Contenido de la Ficha en tarjeta blanca */}
      <View style={styles.detailsCard}>
        {/* Un distintivo por cada tipo con su color propio */}
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} typeName={type} size="medium" />
          ))}
        </View>

        {/* Altura en metros y peso en kilogramos */}
        <View style={styles.specsRow}>
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>ALTURA</Text>
            <Text style={styles.specValue}>{pokemon.heightMeters.toFixed(1)} m</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>PESO</Text>
            <Text style={styles.specValue}>{pokemon.weightKilograms.toFixed(1)} kg</Text>
          </View>
        </View>

        {/* Las 6 estadísticas base, cada una con su valor y barra proporcional (máx 255) */}
        <Text style={styles.sectionTitle}>Estadísticas Base</Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((statItem) => (
            <StatBar
              key={statItem.name}
              statName={statItem.name}
              baseStat={statItem.baseStat}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonPressed: {
    opacity: 0.8,
    backgroundColor: '#F1F5F9',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  cardHeader: {
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  pokemonNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: spacing.xs,
    letterSpacing: 0.5,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  largeImage: {
    width: 190,
    height: 190,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  specsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specBox: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  specDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#CBD5E1',
  },
  statsContainer: {
    marginTop: spacing.xs,
  },
});
