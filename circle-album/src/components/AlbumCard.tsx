import type { AlbumItem } from '../data/albums'
import type { ArcCardLayout } from '../lib/arcPosition'

type AlbumCardProps = {
  item: AlbumItem
  layout: ArcCardLayout
  isActive: boolean
  isDragging: boolean
  onClick: () => void
}

export function AlbumCard({ item, layout, isActive, isDragging, onClick }: AlbumCardProps) {
  return (
    <button
      className={`album-card album-card--${item.palette}`}
      type="button"
      aria-label={`View ${item.title} by ${item.artist}`}
      aria-current={isActive ? 'true' : undefined}
      onClick={onClick}
      style={{
        transform: `translate3d(${layout.x}px, ${layout.y}px, 0) translate(-50%, -50%) rotate(${layout.rotation}deg) scale(${layout.scale})`,
        opacity: layout.opacity,
        zIndex: layout.zIndex,
        transitionDuration: isDragging ? '0ms' : undefined,
        background: item.imageUrl,
      }}
    >
      <span className="album-card__shine" />
      <span className="album-card__content">
        <span className="album-card__eyebrow">{item.country}</span>
        <span className="album-card__title">{item.title}</span>
      </span>
      {item.palette === 'clock' && <span className="album-card__clock">01&nbsp;&nbsp;05</span>}
      {item.palette === 'navy' && <span className="album-card__face" />}
      {item.palette === 'glow' && <span className="album-card__ring" />}
    </button>
  )
}
