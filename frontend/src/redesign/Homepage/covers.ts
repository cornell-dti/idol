export type Cover = { id: string; name: string; src: string; srcSet?: string };
export type CoverPreferences = {
  selected: string;
  custom: Cover[];
  positions: Record<string, number>;
};

export const coverStorageKey = (homepageStorageKey?: string): string =>
  `${homepageStorageKey ?? 'idol:homepage'}:cover`;

const coverDirectory = '/redesign/home/covers';
const presetCover = (id: string, name: string): Cover => ({
  id,
  name,
  src: `${coverDirectory}/${id}.webp`
});

const responsiveCover = (id: string, name: string): Cover => {
  const cover = presetCover(id, name);
  return { ...cover, srcSet: `${coverDirectory}/medium/${id}.webp 1280w, ${cover.src} 2560w` };
};

export const defaultCover = presetCover('idol-work-session', 'IDOL work sesh');
export const presetCovers: Cover[] = [
  responsiveCover('all-members', 'All members'),
  presetCover('info-session', 'Info sesh'),
  presetCover('trends-course', 'Trends course'),
  defaultCover,
  responsiveCover('pms', 'PMs'),
  responsiveCover('tpms', 'TPMs'),
  responsiveCover('designers', 'Designers'),
  responsiveCover('developers', 'Developers'),
  responsiveCover('business', 'Business'),
  responsiveCover('cornellgo', 'CornellGo'),
  responsiveCover('cuapts', 'CU Apts'),
  responsiveCover('curaise', 'CU Raise'),
  responsiveCover('idol', 'IDOL')
];

export const coverThumbnail = (cover: Cover): string =>
  cover.id.startsWith('custom-') ? cover.src : `${coverDirectory}/thumbnails/${cover.id}.webp`;

export const defaultCoverPosition = 50;
export const clampCoverPosition = (position: number): number =>
  Math.min(100, Math.max(0, position));

export const defaultCoverPreferences: CoverPreferences = {
  selected: defaultCover.id,
  custom: [],
  positions: {}
};

export function readCoverPreferences(key: string): CoverPreferences {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) ?? 'null'
    ) as Partial<CoverPreferences> | null;
    const custom = Array.isArray(saved?.custom)
      ? saved.custom
          .filter(
            (cover) =>
              typeof cover?.id === 'string' &&
              cover.id.startsWith('custom-') &&
              typeof cover.name === 'string' &&
              typeof cover.src === 'string' &&
              /^data:image\/(webp|jpeg);base64,/.test(cover.src)
          )
          .map(({ id, name, src }) => ({ id, name, src }))
      : [];
    const available = [...presetCovers, ...custom];
    const selected = available.find((cover) => cover.id === saved?.selected);
    const positions = Object.fromEntries(
      available.flatMap(({ id }) => {
        const position = saved?.positions?.[id];
        return typeof position === 'number' && Number.isFinite(position)
          ? [[id, clampCoverPosition(position)]]
          : [];
      })
    );
    return { selected: selected?.id ?? defaultCover.id, custom, positions };
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
    context.imageSmoothingQuality = 'high';
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
