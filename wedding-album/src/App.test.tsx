import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Wedding Album invitation', () => {
  it('renders five full-screen wedding sections with shared gif, audio, map links, and gallery', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: /wedding album invitation/i })).toBeInTheDocument()
    expect(screen.getAllByTestId(/wedding-section-/)).toHaveLength(5)
    expect(screen.getByTestId('wedding-audio')).toHaveAttribute('src', expect.stringContaining('.mp3'))
    expect(screen.getByTestId('hero-gif')).toHaveAttribute('src', expect.stringContaining('.gif'))
    expect(screen.getByText('이윤종 그리고 이다영')).toBeInTheDocument()
    expect(screen.getByText('2026. 04. 26. 일요일 오전 11시 30분')).toBeInTheDocument()
    expect(screen.getAllByText('비비드예식장 2F, 바우스홀')).toHaveLength(2)
    expect(screen.getByText('소중한 분들을 초대합니다')).toBeInTheDocument()
    expect(screen.getByText(/진실한 사랑으로 꽃피어/)).toBeInTheDocument()
    expect(screen.getAllByText('이아빠')).toHaveLength(2)
    expect(screen.getByText('박엄마')).toBeInTheDocument()
    expect(screen.getByText('윤엄마')).toBeInTheDocument()
    expect(screen.getByText('경기 성남시 분당구 정자일로 95')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /네이버지도/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /카카오맵/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /티맵/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /wedding gallery/i }).length).toBeGreaterThanOrEqual(4)
  })

  it('opens an attendance modal from the share button and lets guests choose attendance', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /전달하기/i }))

    const dialog = screen.getByRole('dialog', { name: /참석 여부/i })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^참석$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^비참석$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^참석$/i }))
    expect(screen.getByText(/참석으로 전달할게요/i)).toBeInTheDocument()
  })
})
