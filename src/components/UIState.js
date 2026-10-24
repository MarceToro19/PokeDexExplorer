// Componente de Estado de Interfaz (Cargando, Error, Sin resultados, Vacío)
// Concepto visto en clase: Componente reutilizable de estados UI (cargando, error, vacío, éxito)
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function UIState({
  type = 'loading', // 'loading' | 'error' | 'empty'
  title,
  message,
  onRetry,
  retryText = 'Reintentar',
}) {
  if (type === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {message || 'Cargando Pokémon...'}
        </Text>
      </View>
    );
  }

  if (type === 'error') {
    return (
      <View style={styles.centerContainer}>
        <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
          <Text style={styles.emojiIcon}>⚠️</Text>
        </View>
        <Text style={styles.title}>{title || 'Ocurrió un error'}</Text>
        <Text style={styles.message}>
          {message || 'No fue posible conectar con la PokéAPI. Comprueba tu conexión a internet.'}
        </Text>
        {onRetry && (
          <Pressable style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>{retryText}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Tipo 'empty' / Sin resultados
  return (
    <View style={styles.centerContainer}>
      <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
        <Text style={styles.emojiIcon}>🔍</Text>
      </View>
      <Text style={styles.title}>{title || 'Sin resultados'}</Text>
      <Text style={styles.message}>
        {message || 'No se encontró ningún Pokémon con ese nombre o número.'}
      </Text>
      {onRetry && (
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={onRetry}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>{retryText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 250,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emojiIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonText: {
    color: colors.text,
  },
});
