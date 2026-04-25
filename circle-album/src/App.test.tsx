import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Circle Album app', () => {
  it('renders a circular album gallery with album cards', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: /circle album/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /interactive circular image carousel/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /view/i }).length).toBeGreaterThan(5)
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
})
