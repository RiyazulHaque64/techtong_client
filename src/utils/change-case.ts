// ----------------------------------------------------------------------

export function paramCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ----------------------------------------------------------------------

export function snakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ----------------------------------------------------------------------

export function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ----------------------------------------------------------------------

export function capitalizeEachWord(string: string) {
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
