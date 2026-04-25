import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { albums } from './data/albums'

describe('Circle Album app', () => {
  it('renders a circular album gallery with real test image cards', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: /circle album/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /interactive circular image carousel/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(30)
    expect(albums).toHaveLength(30)
    expect(albums[0].imageUrl).toContain('real-test-image')
    expect(albums[0].imageUrl).toContain('.jpeg')
  })

  it('renders a translucent full-screen backdrop from the active album image', () => {
    render(<App />)

    const backdrop = screen.getByTestId('active-album-backdrop')
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
    expect(backdrop.getAttribute('style')).toContain('real-test-image')
    expect(backdrop.getAttribute('style')).toContain('.jpeg')
    expect(backdrop).toHaveStyle({ opacity: '0.36' })
  })

  it('moves active card with keyboard arrows and opens details with enter', async () => {
    const user = userEvent.setup()
    render(<App />)

    const carousel = screen.getByRole('region', { name: /interactive circular image carousel/i })
    carousel.focus()
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('opens details in a large responsive post-style modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    const carousel = screen.getByRole('region', { name: /interactive circular image carousel/i })
    carousel.focus()
    await user.keyboard('{Enter}')

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('data-layout', 'immersive-post')
    expect(dialog).toHaveClass('detail-modal--post-size')
  })
})
