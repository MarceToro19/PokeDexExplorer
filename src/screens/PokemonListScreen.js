// Pantalla de Lista de Pokémon con búsqueda y scroll infinito
// Concepto visto en clase: FlatList (numColumns, keyExtractor, onEndReached), useState, useEffect, manejo de estados
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, spacing } from '../theme';
import { fetchPokemonList, fetchPokemonDetail } from '../services/pokeapiService';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import UIState from '../components/UIState';
import useResponsive from '../hooks/useResponsive';

const PAGE_SIZE = 20;

export default function PokemonListScreen({ onSelectPokemon }) {
  const { cardWidth, horizontalPadding, gap } = useResponsive();

  // Estados de datos
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Estados de interfaz (cargando, error, vacío/sin resultados, éxito)
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Estado del texto de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingActive, setIsSearchingActive] = useState(false);

  // Concepto visto en clase: useEffect para cargar los primeros 20 Pokémon al abrir la app
  useEffect(() => {
    loadInitialPokemon();
  }, []);

  const loadInitialPokemon = async () => {
    try {
      setLoadingInitial(true);
      setErrorMessage(null);
      setSearchNotFound(false);

      const data = await fetchPokemonList(PAGE_SIZE, 0);
      setPokemonList(data.results);
      setOffset(PAGE_SIZE);
      setHasMore(data.next !== null);
    } catch (err) {
      setErrorMessage(
        'No se pudo conectar con la PokéAPI. Por favor verifica tu conexión.'
      );
    } finally {
      setLoadingInitial(false);
    }
  };

  // Concepto visto en clase: Scroll infinito con onEndReached (carga 20 más al final)
  const handleLoadMore = async () => {
    // Si estamos en búsqueda activa, o cargando, o no hay más, no pedir
    if (loadingMore || loadingInitial || !hasMore || isSearchingActive) return;

    try {
      setLoadingMore(true);
      const data = await fetchPokemonList(PAGE_SIZE, offset);
      
      // Evitar duplicados por id
      setPokemonList((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = data.results.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });

      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(data.next !== null);
    } catch (err) {
      // Si falla al paginar se puede reintentar en el siguiente scroll
      console.warn('Error al paginar:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Búsqueda directa por nombre o número consumiendo la PokéAPI
  // Concepto visto en clase: Ignorar mayúsculas y espacios al inicio o al final
  const handleSearch = async () => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      handleClearSearch();
      return;
    }

    try {
      setSearchLoading(true);
      setErrorMessage(null);
      setSearchNotFound(false);
      setIsSearchingActive(true);

      const detail = await fetchPokemonDetail(query);

      if (!detail) {
        // Concepto visto en clase: Estado sin resultados
        setSearchNotFound(true);
        setPokemonList([]);
      } else {
        // Mostrar el Pokémon encontrado en la lista
        setPokemonList([
          {
            id: detail.id,
            name: detail.name,
            image: detail.image,
            url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
          },
        ]);
        setHasMore(false);
      }
    } catch (err) {
      setErrorMessage('Ocurrió un error al realizar la búsqueda.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Restablecer la búsqueda y volver a la lista paginada normal
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchingActive(false);
    setSearchNotFound(false);
    setErrorMessage(null);
    loadInitialPokemon();
  };

  // Concepto visto en clase: Renderizado de pie de lista con indicador mientras se cargan más
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Cargando más Pokémon...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con el título "PokéDex Explorer" */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.pokeballBadge}>
            <View style={styles.pokeballTop} />
            <View style={styles.pokeballBottom} />
            <View style={styles.pokeballCenter} />
          </View>
          <Text style={styles.headerTitle}>PokéDex Explorer</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Descubre, busca y explora el mundo Pokémon
        </Text>
      </View>

      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        {/* Barra de búsqueda con TextInput y botón Buscar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isLoading={searchLoading}
        />

        {/* Estado: Cargando inicial */}
        {loadingInitial && (
          <UIState type="loading" message="Cargando los primeros 20 Pokémon..." />
        )}

        {/* Estado: Error */}
        {!loadingInitial && errorMessage && (
          <UIState
            type="error"
            title="Error de conexión"
            message={errorMessage}
            onRetry={isSearchingActive ? handleSearch : loadInitialPokemon}
          />
        )}

        {/* Estado: Sin resultados */}
        {!loadingInitial && !errorMessage && searchNotFound && (
          <UIState
            type="empty"
            title="Pokémon no encontrado"
            message={`No existe ningún Pokémon registrado con el nombre o número "${searchQuery}".`}
            retryText="Ver todos los Pokémon"
            onRetry={handleClearSearch}
          />
        )}

        {/* Estado: Éxito (Cuadrícula de 2 columnas con FlatList) */}
        {!loadingInitial && !errorMessage && !searchNotFound && (
          <FlatList
            data={pokemonList}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <PokemonCard
                pokemon={item}
                width={cardWidth}
                onPress={() => onSelectPokemon(item.id || item.name)}
              />
            )}
            // Concepto visto en clase: onEndReached para scroll infinito
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokeballBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#0F172A',
    overflow: 'hidden',
    position: 'relative',
    marginRight: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  pokeballTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary,
  },
  pokeballBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FFFFFF',
  },
  pokeballCenter: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: '40%',
    height: '40%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingTop: spacing.md,
  },
  listContainer: {
    paddingBottom: spacing.xxl,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
