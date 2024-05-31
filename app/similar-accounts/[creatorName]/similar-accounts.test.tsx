import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import SimilarAccounts from './page'
import { SimilarAccount } from '@/app/dto/similar-account'
import { router } from 'next/client'

vi.mock('next/link', () => {
  return {
    // Mock the behavior of next/link
    default: ({ children }) => {
      return children
    }
  }
})

const mockRoutePush = vi.fn()
vi.mock('next/router', async () => {
  return {
    RouterView: {},
    useRouter: () => {
      return {
        push: mockRoutePush
      }
    }
  }
})

// vi.mock('next/router', () => ({
//   useRouter: vi.fn(() => ({
//     push: () => {}
//   }))
// }))

const mockAccount1: SimilarAccount = {
  instagramUrl: 'https://instagram.com/art0xdev',
  userId: '56785934603',
  username: 'art0xdev',
  profilePicUrl: 'https://instagram.flwo4-2.fna.fbcdn.net/v/t51.2885-19/334790649_6779241472093176_2944578780830400963_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.flwo4-2.fna.fbcdn.net&_nc_cat=100&_nc_ohc=OhrQo46SLRgAX-CwQD3&edm=AGW0Xe4BAAAA&ccb=7-5&oh=00_AfAKtQp5v6ySezaGUQJRCkfmMA0wvaZPbKY1Rku-cu1HQQ&oe=6556CC4E&_nc_sid=94fea1'
}

const mockAccount2: SimilarAccount = {
  instagramUrl: 'https://instagram.com/barbas',
  userId: '56785934103',
  username: 'barbas',
  profilePicUrl: 'https://instagram.flwo4-2.fna.fbcdn.net/v/t51.2885-19/334790649_6779241472093176_2944578780830400963_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.flwo4-2.fna.fbcdn.net&_nc_cat=100&_nc_ohc=OhrQo46SLRgAX-CwQD3&edm=AGW0Xe4BAAAA&ccb=7-5&oh=00_AfAKtQp5v6ySezaGUQJRCkfmMA0wvaZPbKY1Rku-cu1HQQ&oe=6556CC4E&_nc_sid=94fea1'
}

// Mock fetch with successful response
const mockFetchSuccess = (accounts: SimilarAccount[]) => {
  // @ts-ignore
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(accounts)
    })
  )
}

// Mock fetch with failure
const mockFetchFailure = () => {
  // @ts-ignore
  global.fetch = vi.fn(() => Promise.reject('Network error'))
}

describe('SimilarAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  const mockProps = {
    params: {
      creatorName: 'art0xdev'
    }
  }

  test('loads and displays similar accounts', async () => {
    mockFetchSuccess([mockAccount1, mockAccount2])
    render(<SimilarAccounts {...mockProps} />)
    await waitFor(() => {
      const similarAccounts = screen.queryAllByTestId('similar-account')
      expect(similarAccounts).toHaveLength(2)
    })
  })

  test('select and deselect similar accounts', async () => {
    mockFetchSuccess([mockAccount1, mockAccount2])
    render(<SimilarAccounts {...mockProps} />)
    await waitFor(() => {
      const account = screen.getByTestId('art0xdev')
      fireEvent.click(account)

      // expect(account).not.toBeDefined()

      const button = screen.getByTestId('go-to-inspiration')
      fireEvent.click(button)
      //
      // expect(mockRoutePush).toHaveBeenCalledWith(
      //   expect.objectContaining({ name: 'route-name' })
      // )
    })
  })
  //
  test('remove similar account', async () => {
    mockFetchSuccess([mockAccount1])
    render(<SimilarAccounts {...mockProps} />)
    await waitFor(() => {
      const foo = screen.getByTestId('remove-button')
      // fireEvent.click(foo)1
      // const xd = screen.getByTestId(mockAccount1.username)
      // console.log('xd', xd)
      expect(foo).not.toBeDefined()
    })
  })

  // Add more tests for adding new account, error handling, and navigation
})
