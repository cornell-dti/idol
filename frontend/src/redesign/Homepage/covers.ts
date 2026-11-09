export type Cover = { id: string; name: string; src: string };
export type CoverPreferences = { selected: string; custom: Cover[] };

export const presetCovers: Cover[] = [
  { id: 'all-members', name: 'All members', src: '/redesign/home/covers/all-members.webp' },
  { id: 'info-session', name: 'Info sesh', src: '/redesign/home/covers/info-session.webp' },
  { id: 'trends-course', name: 'Trends course', src: '/redesign/home/covers/trends-course.webp' },
  {
    id: 'idol-work-session',
    name: 'IDOL work sesh',
    src: '/redesign/home/covers/idol-work-session.webp'
  }
];

export const defaultCover = presetCovers[3];
export const defaultCoverPreferences: CoverPreferences = { selected: defaultCover.id, custom: [] };

export function readCoverPreferences(key: string): CoverPreferences {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) ?? 'null'
    ) as Partial<CoverPreferences> | null;
    const custom = Array.isArray(saved?.custom)
      ? saved.custom.filter(
          (cover) =>
            typeof cover?.id === 'string' &&
            cover.id.startsWith('custom-') &&
            typeof cover.name === 'string' &&
            typeof cover.src === 'string' &&
            /^data:image\/(webp|jpeg);base64,/.test(cover.src)
        )
      : [];
    const selected = [...presetCovers, ...custom].find((cover) => cover.id === saved?.selected);
    return { selected: selected?.id ?? defaultCover.id, custom };
  } catch {
    return defaultCoverPreferences;
  }
}

export const coverFileTypes = 'image/jpeg,image/png,image/webp';

export async function makeCustomCover(file: File): Promise<Cover> {
  if (!coverFileTypes.split(',').includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.');
  }
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose an image under 20 MB.');

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const webp = canvas.toDataURL('image/webp', 0.82);
    return {
      id: `custom-${crypto.randomUUID()}`,
      name:
        file.name
          .replace(/\.[^.]+$/, '')
          .trim()
          .slice(0, 80) || 'Custom photo',
      src: webp.startsWith('data:image/webp;') ? webp : canvas.toDataURL('image/jpeg', 0.82)
    };
  } catch {
    throw new Error('This photo could not be opened. Try another image.');
  } finally {
    URL.revokeObjectURL(url);
  }
}
