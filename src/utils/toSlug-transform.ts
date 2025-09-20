/** Helper: genera slug legible sin depender de librerías */
export const toSlug = (value: string): string => {
  if (typeof value !== 'string') return value;
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s-]/g, '') // quita símbolos
    .trim()
    .replace(/\s+/g, '-'); // espacios -> guiones
};
