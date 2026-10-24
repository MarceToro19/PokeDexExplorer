// Componente de Barra de Búsqueda
// Concepto visto en clase: Componentes core (TextInput, Pressable/Button), StyleSheet
import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  onClear,
  isLoading,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        {/* Concepto visto en clase: autoCapitalize="none" y autoCorrect={false} */}
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <Pressable onPress={onClear} hitSlop={8} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.searchButtonPressed,
          isLoading && styles.searchButtonDisabled,
        ]}
        onPress={onSearch}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    marginRight: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 48,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
