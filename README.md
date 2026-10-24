# PokéDex Explorer 📱⚡

Aplicación móvil desarrollada con **React Native** y **Expo (plantilla blank sin Expo Router)** para explorar el mundo Pokémon consumiendo la [PokéAPI](https://pokeapi.co/).

---

## 🏗️ Árbol de Carpetas y Responsabilidad de cada Archivo

Tal como se especifica en las pautas de arquitectura del taller, la lógica de red está completamente desacoplada de la interfaz de usuario y los estilos:

```text
PokeDexExplorer/
├── App.js                         # Componente raíz. Maneja el estado de navegación entre la vista de lista y la ficha de detalle dentro de SafeAreaProvider.
├── app.json                       # Configuración general de la app de Expo.
├── package.json                   # Dependencias oficiales de Expo y scripts.
│
└── src/
    ├── services/
    │   └── pokeapiService.js      # Responsabilidad única de red: llamadas HTTP con fetch y async/await, control de response.ok, manejo de 404 plano, parseo de IDs, imágenes oficiales y conversión de unidades (dm a m, hg a kg).
    │
    ├── theme/
    │   └── index.js               # Tokens de diseño: paleta de colores de la interfaz, paleta propia por cada tipo de Pokémon, traducciones al español de tipos y estadísticas, espaciados y tipografías.
    │
    ├── hooks/
    │   └── useResponsive.js       # Hook responsivo personalizado: calcula dimensiones de pantalla, padding y ancho exacto de tarjetas para 2 columnas en móviles y tablets.
    │
    ├── components/
    │   ├── PokemonCard.js         # Tarjeta de Pokémon para la cuadrícula: imagen oficial con dimensiones explícitas, número con 3 dígitos (#025) y nombre capitalizado.
    │   ├── SearchBar.js           # Barra de búsqueda con TextInput (autoCapitalize="none", autoCorrect={false}) y botón "Buscar".
    │   ├── TypeBadge.js           # Distintivo con color propio asignado dinámicamente según el tipo de Pokémon y texto en español.
    │   ├── StatBar.js             # Barra de progreso proporcional para las 6 estadísticas base sobre el valor máximo de 255.
    │   └── UIState.js             # Manejo estandarizado de estados de interfaz: Cargando (spinner + texto), Error (mensaje claro + botón Reintentar) y Sin resultados.
    │
    └── screens/
        ├── PokemonListScreen.js   # Vista de lista: encabezado "PokéDex Explorer", cuadrícula de 2 columnas con FlatList, carga inicial de 20 Pokémon, scroll infinito (onEndReached) con indicador de carga y búsqueda.
        └── PokemonDetailScreen.js # Vista de detalle: imagen grande, número, nombre, distintivos por tipo, altura (m), peso (kg), 6 estadísticas base y botón "Volver a la lista".
```

---

## 🎯 Justificación de la Arquitectura

1. **Separación de Lógica de Red y Presentación**:
   - `pokeapiService.js` aísla todas las peticiones `fetch`. Los componentes y pantallas solo reciben datos procesados y listos para mostrar. Si la API o los endpoints cambiasen en el futuro, solo se modificaría el servicio sin tocar la interfaz ni el JSX.
2. **Modularidad y Reutilización**:
   - Los componentes (`PokemonCard`, `TypeBadge`, `StatBar`, `UIState`, `SearchBar`) son independientes y tienen responsabilidades únicas.
3. **Manejo Robusto de Estados de Interfaz**:
   - Se diseñaron los 4 estados exigidos:
     - **Cargando**: Indicador de carga con texto descriptivo tanto en la lista inicial como en el detalle y al paginar.
     - **Error**: Mensaje claro en español y botón interactivo para reintentar la petición.
     - **Sin resultados**: Mensaje amigable cuando el nombre o número buscado no existe en la PokéAPI (detección de 404 sin romper JSON).
     - **Éxito**: Renderizado limpio de la lista o la ficha.
4. **Patrones Móviles y Rendimiento**:
   - Uso estricto de `FlatList` con `numColumns={2}`, `keyExtractor` y `onEndReached` en lugar de `ScrollView` con `map` para garantizar un rendimiento óptimo de memoria con scroll infinito.
   - Imágenes remotas con ancho y alto explícitos para asegurar renderizado correcto.
   - Peticiones controladas con `useEffect` asegurando que las dependencias eviten bucles infinitos.

---

## 🚀 Instrucciones para Ejecutar el Proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Iniciar el servidor de desarrollo de Expo**:
   ```bash
   npx expo start
   ```
3. **Probar en dispositivo o emulador**:
   - Escanea el código QR con la app **Expo Go** en Android o cámara en iOS.
   - O presiona `a` para abrir el emulador de Android.
   - O presiona `w` para abrir en navegador web.
