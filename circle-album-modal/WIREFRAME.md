# Circle Album 와이어프레임

> 목적: 첨부 레퍼런스처럼 **화면 하단에 이미지 카드들이 원형/아치형 궤도를 따라 배치되고, 드래그/스크롤로 회전하는 인터랙티브 이미지 리스트 웹사이트**를 설계한다.

---

## 1. 제품 컨셉

**Circle Album**은 일반적인 가로 슬라이더가 아니라, 화면 아래쪽의 보이지 않는 큰 원 위에 이미지 카드들을 배치한 **원형 앨범 캐러셀**이다.

- 사용자는 좌우 드래그, 트랙패드/마우스 휠, 키보드로 이미지를 탐색한다.
- 이미지는 화면 하단에 부채꼴/아치형으로 펼쳐진다.
- 중앙에 가까운 카드가 현재 활성 카드가 된다.
- 상단은 거의 비워두어 하단 이미지 움직임이 주인공이 되게 한다.

---

## 2. 디자인 레퍼런스 재해석

이번 UI에 맞는 디자인 방향은 아래 3개를 섞되, 직접 복제하지 않는다.

| 레퍼런스 | 가져올 점 | Circle Album에 적용 |
|---|---|---|
| Apple | 넓은 여백, 제품/이미지 중심, 절제된 UI | 상단을 비우고 하단 이미지 카드만 강하게 노출 |
| Pinterest | 이미지 발견 경험, 시각 콘텐츠 중심 | 카드 자체를 주 콘텐츠로 만들고 메타 정보를 보조화 |
| Framer | 모션 중심의 정교한 웹 경험 | 드래그, 관성, 스냅, 카드 회전 애니메이션 강화 |

### 디자인 톤

- **Minimal gallery**: 전시장 같은 배경과 여백
- **Motion-first**: 정적인 리스트가 아니라 회전하는 오브젝트
- **Editorial archive**: 작가명/국가/프로젝트 정보를 작은 회전 라벨로 제공
- **Image as product**: 버튼과 장식보다 이미지 카드 자체가 주인공

---

## 3. 데스크톱 와이어프레임

```text
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                                                                    │
│                                                                    │
│                       [ Optional Hero Copy ]                       │
│                                                                    │
│                    Circle Album / curated works                    │
│                    Drag, scroll, or use arrows                     │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│       artist       artist        artist       artist       artist  │
│       country      country       country      country      country │
│                                                                    │
│    ╱────────╲   ╱────────╲   ┌────────┐   ╱────────╲   ╱────────╲ │
│   ╱          ╲ ╱          ╲  │        │  ╱          ╲ ╱          ╲│
│  │   CARD     │   CARD     │ │ ACTIVE │ │   CARD     │   CARD    │
│  │            │            │ │  CARD  │ │            │           │
│   ╲          ╱ ╲          ╱  │        │  ╲          ╱ ╲          ╱│
│    ╲────────╱   ╲────────╱   └────────┘   ╲────────╱   ╲────────╱ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 데스크톱 레이아웃 규칙

- Viewport 높이: `100vh`
- 배경: 밝은 회색 `#f4f4f1` 또는 `#f6f6f3`
- 카드 영역: 화면 하단 `45%` 높이 안에서 노출
- 보이지 않는 원 중심: 화면 하단보다 아래쪽, 예: `centerY = viewportHeight + 180px`
- 원 반지름: 데스크톱 기준 `620px ~ 820px`
- 카드 크기: `180px x 260px` 또는 `200px x 300px`
- 중앙 카드: 살짝 더 크게 `scale(1.05)`
- 좌우 끝 카드: 일부 화면 밖으로 잘리게 배치

---

## 4. 모바일 와이어프레임

```text
┌────────────────────────────┐
│                            │
│        Circle Album        │
│     swipe to explore       │
│                            │
│                            │
│                            │
│          artist            │
│          country           │
│                            │
│     ╱─────╲ ┌─────┐ ╱─────╲
│    │ CARD  ││ACTV ││ CARD │
│    │       ││CARD ││      │
│     ╲─────╱ └─────┘ ╲─────╱
└────────────────────────────┘
```

### 모바일 레이아웃 규칙

- 한 화면에 활성 카드 1개 + 좌우 카드 일부만 노출
- 카드 크기: `140px x 210px` 전후
- 원 반지름: `360px ~ 480px`
- 하단 safe-area 고려: `padding-bottom: env(safe-area-inset-bottom)`
- 드래그/스와이프가 기본 조작
- 메타 정보는 활성 카드 위쪽에만 집중적으로 표시하거나, 카드별 회전 라벨을 축소 적용

---

## 5. 핵심 구성 요소

### 5.1 Page Shell

```text
PageShell
├─ Background
├─ OptionalHeader
├─ InteractionHint
└─ ArcCarouselViewport
```

역할:
- 전체 `100vh` 캔버스 제공
- 상단 여백 유지
- 하단 캐러셀 영역 클리핑 처리

### 5.2 ArcCarouselViewport

```text
ArcCarouselViewport
├─ InvisibleCirclePath
├─ CardLayer
│  ├─ ImageCard[]
│  └─ MetadataLabel[]
└─ InteractionLayer
```

역할:
- 하단 영역에 `overflow: hidden`
- 카드들이 원형 좌표를 따라 배치되도록 함
- 드래그/휠/키보드 입력을 받음

### 5.3 ImageCard

```text
ImageCard
├─ Thumbnail image
├─ Optional subtle border
└─ Click target
```

카드 속성:
- 세로형 포스터 비율: `2:3`, `3:4`, `4:5`
- 그림자는 거의 없거나 아주 약하게
- 모서리: `0px ~ 8px`
- 이미지가 가장 중요한 콘텐츠

### 5.4 MetadataLabel

```text
MetadataLabel
├─ title or artist
└─ country / category
```

라벨 속성:
- 카드 근처 배경 위에 배치
- 카드 회전 각도와 비슷하게 회전
- 작은 회색 텍스트
- 예: `font-size: 11px`, `color: #999`, `line-height: 1.2`

---

## 6. 원형 배치 모델

카드는 현재 활성 위치를 기준으로 상대 인덱스를 계산하고, 이를 각도로 변환한다.

```js
relativeIndex = cardIndex - activeIndex + dragOffset
angle = relativeIndex * angleStep
x = centerX + radius * Math.sin(angle)
y = centerY - radius * Math.cos(angle)
rotation = angle
scale = 1 - Math.min(Math.abs(relativeIndex) * 0.035, 0.16)
opacity = 1 - Math.min(Math.abs(relativeIndex) * 0.08, 0.35)
zIndex = 100 - Math.abs(relativeIndex)
```

### 추천 파라미터

| 항목 | 데스크톱 | 모바일 |
|---|---:|---:|
| `angleStep` | `10deg ~ 14deg` | `13deg ~ 18deg` |
| `radius` | `620px ~ 820px` | `360px ~ 480px` |
| `centerY` | `vh + 160px` | `vh + 100px` |
| 카드 너비 | `180px ~ 220px` | `130px ~ 160px` |
| 카드 높이 | `260px ~ 320px` | `190px ~ 230px` |

---

## 7. 인터랙션 와이어프레임

### 7.1 드래그 / 스와이프

```text
Pointer down
→ capture startX
→ pointer move: dragDelta → virtualIndexOffset
→ cards update along circular path
→ pointer up
→ nearest index snap
```

요구사항:
- 드래그 중 카드가 실시간으로 원형 궤도를 따라 이동
- 드래그 종료 시 가장 가까운 카드가 중앙으로 스냅
- 빠르게 드래그하면 관성으로 1~3장 더 이동 가능

### 7.2 마우스 휠 / 트랙패드

```text
wheel deltaY or deltaX
→ convert to carousel offset
→ debounce / inertia
→ snap active card
```

요구사항:
- 세로 휠 입력도 캐러셀 회전으로 변환
- 너무 민감하지 않게 감도 조절
- 페이지 자체 스크롤은 v1에서 막고, 캐러셀 조작에 집중

### 7.3 카드 클릭

```text
Click inactive card
→ animate clicked card to active center

Click active card
→ open detail modal or navigate to detail page
```

v1에서는 상세 페이지 대신 모달 또는 간단한 정보 패널로 충분하다.

### 7.4 키보드 접근성

```text
ArrowLeft  → previous card
ArrowRight → next card
Enter      → open active card detail
Escape     → close detail modal
Tab        → focus visible cards/buttons
```

---

## 8. 상태 정의

```ts
type AlbumItem = {
  id: string;
  title: string;
  artist: string;
  country: string;
  imageUrl: string;
  description?: string;
  href?: string;
};

type CarouselState = {
  activeIndex: number;
  dragOffset: number;
  isDragging: boolean;
  velocity: number;
  selectedItemId?: string;
};
```

---

## 9. 화면 상태

### 9.1 Default

- 중앙 카드가 활성 상태
- 좌우 카드가 아치형으로 노출
- 상단에는 최소 제목/힌트만 표시

### 9.2 Dragging

- 커서: `grabbing`
- transition 일부 비활성화
- 드래그 위치에 맞춰 카드가 즉시 반응

### 9.3 Snapping

- 드래그 종료 후 spring/ease 애니메이션
- 중앙 카드가 정렬됨
- 활성 라벨 업데이트

### 9.4 Detail Open

- 활성 카드 클릭 시 모달/패널 표시
- 배경 캐러셀은 약간 dim 또는 blur
- Escape / Close 버튼으로 닫기

### 9.5 Empty / Loading

- Loading: 카드 skeleton을 하단 아치 형태로 표시
- Empty: 중앙에 `No images yet` 텍스트와 업로드/추가 CTA

---

## 10. 접근성 요구사항

- 모든 카드는 버튼 또는 링크 역할을 명확히 가진다.
- 활성 카드에는 `aria-current="true"` 또는 유사 상태 제공.
- 캐러셀 영역에 `aria-label="Interactive circular image carousel"` 제공.
- 키보드 방향키 탐색 지원.
- 모션 민감 사용자 대응:

```css
@media (prefers-reduced-motion: reduce) {
  .carousel-card {
    transition: none;
  }
}
```

- 텍스트 대비: 작은 메타 라벨은 장식성이라면 낮은 대비 가능, 핵심 정보라면 충분한 대비 필요.

---

## 11. v1 범위

### 포함

- 하단 원형/아치형 카드 배치
- 좌우 드래그/스와이프
- 휠/트랙패드 탐색
- 활성 카드 스냅
- 카드 클릭 시 활성화
- 활성 카드 클릭 시 간단 상세 모달
- 키보드 좌우 이동
- 반응형 데스크톱/모바일 레이아웃

### v1 제외

- 이미지 업로드 관리자
- 서버/API 연동
- 사용자 로그인
- 복잡한 프로젝트 상세 페이지
- 무한 3D 물리 시뮬레이션
- WebGL 필수 구현

---

## 12. 구현 메모

추천 프론트엔드 구조:

```text
circle-album/
├─ WIREFRAME.md
├─ DESIGN.md
├─ IMPLEMENTATION_PLAN.md
└─ src/
   ├─ data/albums.ts
   ├─ components/ArcCarousel.tsx
   ├─ components/AlbumCard.tsx
   ├─ components/AlbumDetailModal.tsx
   ├─ hooks/useArcCarousel.ts
   └─ styles/circle-album.css
```

추천 구현 방식:
- React 또는 Next.js 기준으로 컴포넌트 분리
- 애니메이션은 v1에서 CSS transform + requestAnimationFrame으로 충분
- 이후 Framer Motion을 붙이면 spring/snap 품질 개선 가능
- 좌표 계산은 hook으로 분리하여 테스트 가능하게 설계

---

## 13. 인수 기준

- [ ] 첫 화면에서 하단 아치형 이미지 리스트가 즉시 보인다.
- [ ] 중앙 카드가 가장 활성화되어 보인다.
- [ ] 좌우 카드들이 원형 궤도처럼 기울어져 배치된다.
- [ ] 드래그/스와이프로 카드들이 부드럽게 이동한다.
- [ ] 드래그 종료 후 가까운 카드로 스냅된다.
- [ ] 마우스 휠/트랙패드로 탐색 가능하다.
- [ ] 키보드 방향키로 탐색 가능하다.
- [ ] 모바일에서 좌우 카드 일부가 보이고 스와이프 가능하다.
- [ ] `prefers-reduced-motion` 환경에서 과도한 애니메이션이 줄어든다.
