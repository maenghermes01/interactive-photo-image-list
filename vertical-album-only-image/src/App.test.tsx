import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { albums } from './data/albums'

describe('Vertical Album only-image app', () => {
  it('renders a full-screen horizontal carousel using shared real images only', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: /vertical album/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /horizontal image carousel/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /archive/i })).toHaveLength(30)
    expect(albums).toHaveLength(30)
    expect(albums[0].imageUrl).toContain('real-test-image')
    expect(albums[0].imageUrl).toContain('.jpeg')
    expect(screen.queryByText(/interactive photo image list/i)).not.toBeInTheDocument()
  })

  it('shows the active image as a large centered panel and moves with keyboard arrows', async () => {
    const user = userEvent.setup()
    render(<App />)

    const carousel = screen.getByRole('region', { name: /horizontal image carousel/i })
    const activeImage = screen.getByTestId('active-vertical-image')

    expect(activeImage).toHaveAttribute('alt', 'Archive 004')
    expect(activeImage).toHaveClass('active-vertical-image')

    carousel.focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByTestId('active-vertical-image')).toHaveAttribute('alt', 'Archive 005')
  })
})
