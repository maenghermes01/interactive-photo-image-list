import type { AlbumItem } from '../data/albums'

type AlbumDetailModalProps = {
  item: AlbumItem
  onClose: () => void
}

export function AlbumDetailModal({ item, onClose }: AlbumDetailModalProps) {
  return (
    <div className="detail-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="detail-modal detail-modal--post-size"
        data-layout="immersive-post"
        role="dialog"
        aria-labelledby="detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="detail-modal__preview" style={{ background: item.imageUrl }} />
        <div className="detail-modal__copy">
          <p>{item.artist} · {item.country}</p>
          <h2 id="detail-title">{item.title}</h2>
          <p>{item.description}</p>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  )
}
