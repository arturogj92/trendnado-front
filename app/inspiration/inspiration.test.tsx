import Inspiration from './page'
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { Reel } from '@/app/dto/reel'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue({
    getAll: vi.fn().mockReturnValue(['8242141302'])
  })
}))

const mockFetchWithReel = (reels: Reel[]) => {
  // @ts-ignore
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(reels)
    })
  )
}

const aReel: Reel = { instagramUrl: 'http://instagram.com/reel', videoUrl: 'http://video.com/reel.mp4', likes: 100, playCount: 200 }

describe('Inspiration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test('initial state is loading and no reels', async () => {
    mockFetchWithReel([])
    render(<Inspiration />)

    await waitFor(() => {
      const reelElements = screen.queryAllByRole('video')
      expect(reelElements).toHaveLength(0)
    })
  })

  test('loads and displays reels', async () => {
    mockFetchWithReel([aReel, aReel])
    render(<Inspiration />)
    await waitFor(() => {
      const reelElements = screen.queryAllByRole('video')
      expect(reelElements).toHaveLength(2)
    })
  })

  test('handles error when fetching reels', async () => {
    mockFetchWithReel([])

    render(<Inspiration />)
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeDefined()
    })
  })
})
