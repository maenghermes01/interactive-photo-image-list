export type AlbumItem = {
  id: string
  title: string
  artist: string
  country: string
  palette: string
  imageUrl: string
  rawUrl: string
  description: string
}

const realImageModules = import.meta.glob('../../../shared/image/real-test-image/*.jpeg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const realImageUrls = Object.entries(realImageModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url)

const albumMeta = [
  ['Archive 001', 'Real Test Image', 'Set A'],
  ['Archive 002', 'Real Test Image', 'Set A'],
  ['Archive 003', 'Real Test Image', 'Set A'],
  ['Archive 004', 'Real Test Image', 'Set A'],
  ['Archive 005', 'Real Test Image', 'Set A'],
  ['Archive 006', 'Real Test Image', 'Set B'],
  ['Archive 007', 'Real Test Image', 'Set B'],
  ['Archive 008', 'Real Test Image', 'Set B'],
  ['Archive 009', 'Real Test Image', 'Set B'],
  ['Archive 010', 'Real Test Image', 'Set B'],
  ['Archive 011', 'Real Test Image', 'Set C'],
  ['Archive 012', 'Real Test Image', 'Set C'],
  ['Archive 013', 'Real Test Image', 'Set C'],
  ['Archive 014', 'Real Test Image', 'Set C'],
  ['Archive 015', 'Real Test Image', 'Set C'],
  ['Archive 016', 'Real Test Image', 'Set D'],
  ['Archive 017', 'Real Test Image', 'Set D'],
  ['Archive 018', 'Real Test Image', 'Set D'],
  ['Archive 019', 'Real Test Image', 'Set D'],
  ['Archive 020', 'Real Test Image', 'Set D'],
  ['Archive 021', 'Real Test Image', 'Set E'],
  ['Archive 022', 'Real Test Image', 'Set E'],
  ['Archive 023', 'Real Test Image', 'Set E'],
  ['Archive 024', 'Real Test Image', 'Set E'],
  ['Archive 025', 'Real Test Image', 'Set E'],
  ['Archive 026', 'Real Test Image', 'Set F'],
  ['Archive 027', 'Real Test Image', 'Set F'],
  ['Archive 028', 'Real Test Image', 'Set F'],
  ['Archive 029', 'Real Test Image', 'Set F'],
  ['Archive 030', 'Real Test Image', 'Set F'],
] as const

export const albums: AlbumItem[] = realImageUrls.map((url, index) => {
  const [title, artist, country] = albumMeta[index] ?? [
    `Archive ${String(index + 1).padStart(3, '0')}`,
    'Real Test Image',
    'Image Set',
  ]

  return {
    id: `real-test-image-${String(index + 1).padStart(3, '0')}`,
    title,
    artist,
    country,
    palette: 'photo',
    imageUrl: `url("${url}")`,
    rawUrl: url,
    description: `Real test image ${String(index + 1).padStart(3, '0')} from the circle album image set.`,
  }
})
