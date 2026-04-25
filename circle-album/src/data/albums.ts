export type AlbumItem = {
  id: string
  title: string
  artist: string
  country: string
  palette: string
  imageUrl: string
  description: string
}

export const albums: AlbumItem[] = [
  {
    id: 'navy-face',
    title: 'Night Signal',
    artist: 'Mauricio Spikzudo',
    country: 'Italy',
    palette: 'navy',
    imageUrl: 'linear-gradient(155deg, #07122e 0%, #0c1f4d 100%)',
    description: 'A quiet abstract poster with a yellow moon and a neon accent.',
  },
  {
    id: 'wave-theory',
    title: 'Dispersion of Waves',
    artist: 'Albin de Moropa',
    country: 'Uruguay',
    palette: 'paper',
    imageUrl: 'linear-gradient(160deg, #f7fbff 0%, #dbeeff 100%)',
    description: 'Editorial typography exploring wave interference and soft blue air.',
  },
  {
    id: 'cyan-label',
    title: 'Blue Label Study',
    artist: 'Naomi Okazato',
    country: 'Japan',
    palette: 'cyan',
    imageUrl: 'linear-gradient(160deg, #10bde8 0%, #0086d1 100%)',
    description: 'A liquid cyan poster inspired by label systems and coded movement.',
  },
  {
    id: 'flip-clock',
    title: '01 05',
    artist: 'Sven Meitzel',
    country: 'Netherlands',
    palette: 'clock',
    imageUrl: 'linear-gradient(180deg, #111 0%, #050505 100%)',
    description: 'A flip-clock composition for the current selected album state.',
  },
  {
    id: 'dotted-portrait',
    title: 'Dotted Portrait',
    artist: 'Wika Fatkas',
    country: 'Brazil',
    palette: 'portrait',
    imageUrl: 'radial-gradient(circle at 50% 42%, #ffe1d8 0 18%, transparent 19%), radial-gradient(circle at 50% 32%, #1b1b20 0 24%, transparent 25%), linear-gradient(145deg, #87d8e8 0%, #dff8ff 100%)',
    description: 'A dotted portrait card with a soft cyan background and pop-art rhythm.',
  },
  {
    id: 'tri-color',
    title: 'Tri-color Particle',
    artist: 'Fermin Guerrero',
    country: 'Uruguay',
    palette: 'glow',
    imageUrl: 'radial-gradient(circle at 54% 42%, rgba(255,0,153,.9), transparent 16%), radial-gradient(circle at 44% 44%, rgba(0,255,204,.8), transparent 18%), linear-gradient(155deg, #060606 0%, #111 100%)',
    description: 'A neon particle ring floating on black like a tiny generative sculpture.',
  },
  {
    id: 'korean-blue',
    title: 'Soft Blue Index',
    artist: 'Kimoon Kim',
    country: 'South Korea',
    palette: 'blueprint',
    imageUrl: 'linear-gradient(145deg, #d8f0ff 0%, #88bfff 100%)',
    description: 'A pale blue graphic index card with modular geometric shapes.',
  },
  {
    id: 'aqua-poster',
    title: 'Aqua Cut',
    artist: 'Pablo Merida',
    country: 'Mexico',
    palette: 'aqua',
    imageUrl: 'linear-gradient(160deg, #eafff7 0%, #55d4b4 100%)',
    description: 'A cropped aqua poster that hints at more work beyond the viewport.',
  },
]
