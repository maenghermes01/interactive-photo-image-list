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
      className="album-card"
      type="button"
      aria-label={item.title}
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
    </button>
  )
}