// PokéAPI service
// Concepto visto en clase: Separación de la lógica de red de la interfaz (fetch y async/await)

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Extracts the Pokémon ID from its resource URL.
 * URL format: "https://pokeapi.co/api/v2/pokemon/{id}/"
 * @param {string} url
 * @returns {number}
 */
export function getPokemonIdFromUrl(url) {
  if (!url) return null;
  const segments = url.trim().replace(/\/$/, '').split('/');
  const idStr = segments[segments.length - 1];
  return parseInt(idStr, 10);
}

/**
 * Returns the official artwork URL given a Pokemon ID without requesting the full endpoint.
 * URL: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
 * @param {number|string} id
 * @returns {string}
 */
export function getPokemonImageUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Formats a number with leading zeros (e.g. 25 -> "#025")
 * Concepto visto en clase: String(id).padStart(3, '0')
 * @param {number|string} id
 * @returns {string}
 */
export function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fetches a paginated list of Pokémon.
 * Concepto visto en clase: Consumo de API REST con fetch y async/await
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{ count: number, next: string|null, results: Array<{ name: string, id: number, image: string }> }>}
 */
export async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  
  // Concepto visto en clase: Validación de response.ok antes de llamar .json()
  if (!response.ok) {
    throw new Error(`Error en el servidor al cargar la lista (${response.status})`);
  }

  const data = await response.json();

  const formattedResults = data.results.map((item) => {
    const id = getPokemonIdFromUrl(item.url);
    return {
      name: item.name,
      url: item.url,
      id,
      image: getPokemonImageUrl(id),
    };
  });

  return {
    count: data.count,
    next: data.next,
    results: formattedResults,
  };
}

/**
 * Fetches the complete details of a specific Pokémon by name or id.
 * Handles 404 cleanly (returns null if not found).
 * Concepto visto en clase: response.ok, manejo de 404 plano
 * @param {string|number} identifier
 * @returns {Promise<object|null>}
 */
export async function fetchPokemonDetail(identifier) {
  if (!identifier) return null;

  // Sanitizar búsqueda: minúsculas y sin espacios al inicio o final
  const cleanQuery = String(identifier).trim().toLowerCase();

  const response = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(cleanQuery)}`);

  // La API responde 404 con texto plano cuando no existe el Pokémon
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Error al cargar el Pokémon (${response.status})`);
  }

  const data = await response.json();

  // Concepto visto en clase: altura en decímetros / 10 = metros, peso en hectogramos / 10 = kilogramos
  return {
    id: data.id,
    name: data.name,
    heightMeters: data.height / 10,
    weightKilograms: data.weight / 10,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      baseStat: s.base_stat,
    })),
    image:
      data.sprites?.other?.['official-artwork']?.front_default ||
      getPokemonImageUrl(data.id),
  };
}
