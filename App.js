// Entry point de la aplicación PokéDex Explorer
// Concepto visto en clase: Plantilla blank con un solo App.js (sin Expo Router)
// Manejo de pantalla principal con dos vistas: lista de Pokémon y ficha de detalle
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import { colors } from './src/theme';

export default function App() {
  // Estado para controlar la vista actual:
  // null = Vista de lista
  // identifier (id o nombre) = Vista de detalle del Pokémon seleccionado
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" backgroundColor={colors.surface} />
        <View style={styles.container}>
          {selectedPokemonId ? (
            <PokemonDetailScreen
              pokemonIdentifier={selectedPokemonId}
              onBack={() => setSelectedPokemonId(null)}
            />
          ) : (
            <PokemonListScreen
              onSelectPokemon={(id) => setSelectedPokemonId(id)}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
