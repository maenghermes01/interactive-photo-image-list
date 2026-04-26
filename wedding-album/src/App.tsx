import { useRef, useState } from 'react'
import heroGifUrl from '../../shared/gif/KakaoTalk_Photo_2026-04-26-11-15-04.gif?url'
import weddingAudioUrl from '../../shared/audio/1251. Jelly Steps.mp3?url'
import './styles/wedding-album.css'

type GalleryImage = {
  id: string
  src: string
}

const imageModules = import.meta.glob('../../shared/image/real-test-image/*.jpeg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const galleryImages: GalleryImage[] = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .slice(0, 8)
  .map(([path, src], index) => ({ id: `${path}-${index}`, src }))

function AudioButton({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      className={`audio-button ${isPlaying ? 'is-playing' : ''}`}
      onClick={toggleAudio}
    >
      <span />
      <span />
      <span />
    </button>
  )
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [choice, setChoice] = useState<'attend' | 'absent' | null>(null)

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="참석 여부"
        className="rsvp-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">RSVP</p>
        <h2>참석 여부를 전달해주세요</h2>
        <p className="modal-copy">소중한 마음을 신랑 신부에게 전할게요.</p>
        <div className="modal-actions">
          <button type="button" onClick={() => setChoice('attend')}>참석</button>
          <button type="button" onClick={() => setChoice('absent')}>비참석</button>
        </div>
        {choice && (
          <p className="modal-result">
            {choice === 'attend' ? '참석으로 전달할게요.' : '비참석으로 전달할게요.'}
          </p>
        )}
        <button type="button" className="modal-close" onClick={onClose}>닫기</button>
      </section>
    </div>
  )
}

export default function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return (
    <main className="wedding-shell" aria-label="Wedding Album Invitation">
      <audio ref={audioRef} data-testid="wedding-audio" src={weddingAudioUrl} loop preload="metadata" />
      <AudioButton audioRef={audioRef} />

      <section data-testid="wedding-section-1" className="wedding-section hero-section">
        <div className="name-arc" aria-label="이윤종 그리고 이다영">이윤종 그리고 이다영</div>
        <img data-testid="hero-gif" className="hero-gif" src={heroGifUrl} alt="wedding opening animation" />
        <div className="hero-line" />
      </section>

      <section data-testid="wedding-section-2" className="wedding-section family-section">
        <p className="eyebrow">Together with their families</p>
        <div className="family-card" aria-label="혼주와 신랑 신부 소개">
          <p><strong>이아빠</strong><span>·</span><strong>박엄마</strong></p>
          <p>의</p>
          <p>장남</p>
          <h2>이윤종</h2>
          <div className="divider">|</div>
          <p><strong>이아빠</strong><span>·</span><strong>윤엄마</strong></p>
          <p>의</p>
          <p>장녀</p>
          <h2>이다영</h2>
        </div>
      </section>

      <section data-testid="wedding-section-3" className="wedding-section map-section">
        <p className="eyebrow">Location</p>
        <h2>오시는 길</h2>
        <p className="venue">서울의 어느 따뜻한 예식장</p>
        <div className="map-card" aria-hidden="true">
          <div className="map-river" />
          <div className="map-pin">Wedding</div>
        </div>
        <div className="map-actions">
          <a href="https://map.naver.com" target="_blank" rel="noreferrer">네이버 지도</a>
          <a href="https://map.kakao.com" target="_blank" rel="noreferrer">카카오 지도</a>
        </div>
      </section>

      <section data-testid="wedding-section-4" className="wedding-section gallery-section">
        <div className="gallery-track" aria-label="Wedding gallery">
          {galleryImages.map((image, index) => (
            <img key={image.id} src={image.src} alt={`wedding gallery ${index + 1}`} />
          ))}
        </div>
      </section>

      <section data-testid="wedding-section-5" className="wedding-section closing-section">
        <p className="eyebrow">Thank you</p>
        <h2>마음을 전해주세요</h2>
        <p>축하의 마음과 참석 여부를 신랑 신부에게 전달할 수 있어요.</p>
        <button type="button" className="share-button" onClick={() => setIsRsvpOpen(true)}>전달하기</button>
      </section>

      {isRsvpOpen && <RsvpModal onClose={() => setIsRsvpOpen(false)} />}
    </main>
  )
}
