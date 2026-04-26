import { describe, expect, it } from 'vitest'
import { calculateArcLayout, wrapIndex } from './arcPosition'

describe('wrapIndex', () => {
  it('wraps indexes across album boundaries', () => {
    expect(wrapIndex(0, 6)).toBe(0)
    expect(wrapIndex(6, 6)).toBe(0)
    expect(wrapIndex(-1, 6)).toBe(5)
  })
})

describe('calculateArcLayout', () => {
  it('places the active card at the visual center with the highest z-index', () => {
    const layout = calculateArcLayout({
      itemCount: 7,
      activeIndex: 3,
      viewportWidth: 1200,
      viewportHeight: 800,
    })

    const active = layout.find((item) => item.index === 3)
    expect(active).toBeDefined()
    expect(active?.relativeIndex).toBe(0)
    expect(active?.x).toBeCloseTo(600, 0)
    expect(active?.rotation).toBeCloseTo(0, 2)
    expect(active?.scale).toBeGreaterThan(1)
    expect(active?.zIndex).toBe(100)
  })

  it('rotates left cards counter-clockwise and right cards clockwise', () => {
    const layout = calculateArcLayout({
      itemCount: 5,
      activeIndex: 2,
      viewportWidth: 1000,
      viewportHeight: 700,
    })

    const left = layout.find((item) => item.index === 1)
    const right = layout.find((item) => item.index === 3)

    expect(left?.rotation).toBeLessThan(0)
    expect(right?.rotation).toBeGreaterThan(0)
    expect(left?.x).toBeLessThan(500)
    expect(right?.x).toBeGreaterThan(500)
  })

  it('supports fractional drag offsets for in-between positions', () => {
    const layout = calculateArcLayout({
      itemCount: 5,
      activeIndex: 2,
      dragOffset: 0.5,
      viewportWidth: 1000,
      viewportHeight: 700,
    })

    const active = layout.find((item) => item.index === 2)
    expect(active?.relativeIndex).toBeCloseTo(0.5)
    expect(active?.rotation).toBeGreaterThan(0)
    expect(active?.x).toBeGreaterThan(500)
  })
})
