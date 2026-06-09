// Fallback del slot paralelo `@modal`: nada renderizado cuando el modal no está
// activo (carga inicial, refresh o navegación dura a una ruta sin intercepción).
export default function Default() {
  return null;
}
