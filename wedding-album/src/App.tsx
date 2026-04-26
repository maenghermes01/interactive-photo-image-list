import { useEffect, useRef, useState } from 'react'
import weddingAudioUrl from '../../shared/audio/1251. Jelly Steps.mp3?url'
import heroVideoPosterUrl from '../../shared/video/hero-wedding-poster.jpg?url'
import heroVideoUrl from '../../shared/video/hero-wedding-film.mp4?url'
import { VerticalAlbumCarousel } from './components/VerticalAlbumCarousel'
import './styles/vertical-album.css'
import './styles/wedding-album.css'

function AudioButton({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      className={`audio-button ${isPlaying ? 'is-playing' : ''}`}
      onClick={onToggle}
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

type AccountItem = {
  name: string
  bank: string
  number: string
}

type AccountGroup = {
  title: string
  items: AccountItem[]
}

const accountGroups: AccountGroup[] = [
  {
    title: '신랑측 계좌번호',
    items: [
      { name: '이윤종', bank: 'IBK기업', number: '000-000000-00-000' },
      { name: '이아빠', bank: 'KB국민', number: '000000-00-000000' },
      { name: '박엄마', bank: 'IBK기업', number: '000-000000-00-000' },
    ],
  },
  {
    title: '신부측 계좌번호',
    items: [
      { name: '이다영', bank: '카카오뱅크', number: '0000-00-0000000' },
      { name: '이아빠', bank: '부산은행', number: '000-00-000000-0' },
      { name: '윤엄마', bank: '우리은행', number: '0000-000-000000' },
    ],
  },
]

function AccountSection() {
  const [openGroups, setOpenGroups] = useState(() => accountGroups.map(group => group.title))
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => (
      prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
    ))
  }

  const copyAccount = async (account: AccountItem) => {
    const text = `${account.name} ${account.bank} ${account.number}`
    await navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedKey(`${account.name}-${account.bank}`)
    window.setTimeout(() => setCopiedKey(null), 1300)
  }

  return (
    <section data-testid="wedding-section-6" className="wedding-section account-section">
      <div className="account-inner">
        <p className="script-title">Account</p>
        <h2>마음 전하는 곳</h2>
        <div className="account-copy">
          <p>참석이 어려우신 분들을 위해</p>
          <p>계좌번호를 안내해 드립니다.</p>
          <p>너그러운 마음으로 양해 부탁드립니다.</p>
        </div>

        <div className="account-card-list">
          {accountGroups.map(group => {
            const isOpen = openGroups.includes(group.title)
            return (
              <article className="account-card" key={group.title}>
                <button
                  type="button"
                  className="account-card__header"
                  aria-expanded={isOpen}
                  aria-label={`${group.title} ${isOpen ? '접기' : '펼치기'}`}
                  onClick={() => toggleGroup(group.title)}
                >
                  <span>{group.title}</span>
                  <span className={`account-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">⌃</span>
                </button>
                {isOpen && (
                  <div className="account-rows">
                    {group.items.map(account => {
                      const copied = copiedKey === `${account.name}-${account.bank}`
                      return (
                        <div className="account-row" key={`${group.title}-${account.name}-${account.bank}`}>
                          <span className="account-name">{account.name}</span>
                          <span className="account-number">{account.bank} {account.number}</span>
                          <button
                            type="button"
                            className="account-copy-button"
                            aria-label={`${account.name} 계좌 복사`}
                            onClick={() => copyAccount(account)}
                          >
                            {copied ? '완료' : '복사'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const [isHeroPlaying, setIsHeroPlaying] = useState(true)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.play().catch(() => {
      const onInteraction = () => {
        audio.play().catch(() => {})
        window.removeEventListener('pointerdown', onInteraction)
      }
      window.addEventListener('pointerdown', onInteraction)
    })
  }, [])

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
    } else {
      await audio.play().catch(() => {})
    }
  }

  const toggleHeroVideo = async () => {
    const video = heroVideoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setIsHeroPlaying(true)
      } catch {
        setIsHeroPlaying(false)
      }
      return
    }

    video.pause()
    setIsHeroPlaying(false)
  }

  return (
    <main className="wedding-shell" aria-label="Wedding Album Invitation">
      <audio
        ref={audioRef}
        data-testid="wedding-audio"
        src={weddingAudioUrl}
        loop
        preload="metadata"
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
      />
      <AudioButton isPlaying={isAudioPlaying} onToggle={toggleAudio} />

      <section data-testid="wedding-section-1" className="wedding-section hero-section" aria-label="웨딩 오프닝 영상">
        <video
          ref={heroVideoRef}
          data-testid="hero-video"
          className="hero-video"
          src={heroVideoUrl}
          poster={heroVideoPosterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsHeroPlaying(true)}
          onPause={() => setIsHeroPlaying(false)}
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-title-stack" aria-label="Lovely Wedding">
          <span>Lovely</span>
          <strong>Wedding</strong>
        </div>
        <div className="hero-bottom-copy">
          <p>이윤종 그리고 이다영</p>
          <p>APR 26, 2026 AT 11:30 AM</p>
          <p>비비드예식장 2F, 바우스홀</p>
        </div>
        <button
          type="button"
          className={`hero-play-button ${isHeroPlaying ? 'is-playing' : ''}`}
          aria-label={isHeroPlaying ? '히어로 영상 일시정지' : '히어로 영상 재생'}
          onClick={toggleHeroVideo}
        >
          <span aria-hidden="true" />
        </button>
      </section>

      <section data-testid="wedding-section-2" className="wedding-section invitation-section">
        <div className="invitation-copy">
          <div className="hero-meta">
            <p>2026. 04. 26. 일요일 오전 11시 30분</p>
            <p>비비드예식장 2F, 바우스홀</p>
          </div>
          <h2>소중한 분들을 초대합니다</h2>
          <p>
            저희 두 사람의 작은 만남이<br />
            진실한 사랑으로 꽃피어<br />
            오늘 이 자리를 빛내는 결혼식으로 이어졌습니다.
          </p>
          <p>
            평생 서로를 귀히 여기며<br />
            처음의 설렘과 순수함을 잃지 않고<br />
            존중하고 아껴 나가겠습니다.
          </p>
          <p>
            믿음과 사랑을 기초로 한 이 날에<br />
            여러분의 따뜻한 축복이 함께 한다면<br />
            더할 나위 없는 기쁨으로 간직하겠습니다.
          </p>
          <div className="ornament" aria-hidden="true">♡</div>
          <p className="couple-line">신랑 이윤종 · 신부 이다영</p>
        </div>
        <div className="family-inline" aria-label="혼주와 신랑 신부 소개">
          <span><strong>이아빠</strong> · <strong>박엄마</strong>의 장남 <b>이윤종</b></span>
          <i>|</i>
          <span><strong>이아빠</strong> · <strong>윤엄마</strong>의 장녀 <b>이다영</b></span>
        </div>
      </section>

      <section data-testid="wedding-section-3" className="wedding-section map-section">
        <p className="script-title">Location</p>
        <h2>오시는 길</h2>
        <p className="venue">비비드예식장 2F, 바우스홀</p>
        <p className="address"><span aria-hidden="true">▣</span> 경기 성남시 분당구 정자일로 95</p>
        <div className="map-card" aria-label="네이버 지도 미리보기">
          <div className="map-road map-road--one" />
          <div className="map-road map-road--two" />
          <div className="map-river" />
          <span className="map-label label-1">마세라티</span>
          <span className="map-label label-2">롯데하이마트</span>
          <span className="map-label label-3">더샵스타파크</span>
          <span className="map-label label-4">미켈란쉐르빌</span>
          <span className="map-label label-5">늘푸른중학교</span>
          <div className="map-pin">NAVER 1784</div>
        </div>
        <div className="map-actions">
          <a href="https://map.naver.com" target="_blank" rel="noreferrer"><span>⌖</span>네이버지도</a>
          <a href="https://map.kakao.com" target="_blank" rel="noreferrer"><span>●</span>카카오맵</a>
        </div>
      </section>

      <section data-testid="wedding-section-4" className="wedding-section gallery-section">
        <VerticalAlbumCarousel />
      </section>

      <section data-testid="wedding-section-5" className="wedding-section closing-section">
        <p className="script-title">Rsvp</p>
        <h2>참석 의사 전달</h2>
        <p>신랑, 신부에게 참석의사를<br />미리 전달할 수 있어요.</p>
        <button type="button" className="share-button" onClick={() => setIsRsvpOpen(true)}>
          <span aria-hidden="true">➤</span>
          전달하기
        </button>
      </section>

      <AccountSection />

      {isRsvpOpen && <RsvpModal onClose={() => setIsRsvpOpen(false)} />}
    </main>
  )
}
