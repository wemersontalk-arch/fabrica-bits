export function slugify(text: string): string {
  if (!text) return 'produto';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos (é->e, á->a, ã->a, ç->c, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens sobrando no início ou fim
}
