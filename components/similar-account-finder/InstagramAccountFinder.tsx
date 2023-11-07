'use client'

import { useState } from 'react'
import '../../public/css/globals.css'
import { Modal } from '@/components/modal/Modal'
import { SimilarAccount } from '@/app/dto/similar-account'
import { encodeUrl } from '@/shared/url-encoder'

export function InstagramAccountFinder () {
  const [showModalInstagramAccountSearchFinder, setShowModalInstagramAccountSearchFinder] = useState(false)
  const [instagramAccountQuerySearch, setInstagramAccountQuerySearch] = useState('')
  const [instagramAccountsFound, setInstagramAccountsFound] = useState([{}] as any)

  const searchInstagramUsers = (instagramAccountQuerySearch: string): Promise<any> => {
    if (instagramAccountQuerySearch.length < 3) return Promise.resolve(null)
    const instagramUsers = fetch(`http://localhost:3003/similar-accounts/search?search_query=${instagramAccountQuerySearch}`, { next: { revalidate: 10 } })
    return instagramUsers.then((response) => {
      return response.json()
    })
  }
  const onClickFindInstagramUser = async () => {
    const instagramAccountsSearchResponse = await searchInstagramUsers(instagramAccountQuerySearch)
    const similarAccounts = instagramAccountsSearchResponse?.similarAccounts
    similarAccounts.forEach((similarAccount: SimilarAccount) => {
      similarAccount.profilePicUrl = getImageFromProxy(similarAccount.profilePicUrl)
    })
    updateInstagramAccountsFound(similarAccounts)
  }

  const updateInstagramAccountsFound = (similarAccounts: {}): void => setInstagramAccountsFound(similarAccounts)

  const showInstagramAccountVisibility = (similarAccount: SimilarAccount) => similarAccount.isPrivate ? '🔒' : ''

  const getImageFromProxy = (videoUrl: string): string => {
    return `http://localhost:3003/proxy?videoUrl="${encodeUrl(videoUrl)}"`
  }

  return (
    <>
      <div onClick={() => setShowModalInstagramAccountSearchFinder(true)} className='similar-account-finder' />
      {showModalInstagramAccountSearchFinder &&
        <Modal onClose={() => setShowModalInstagramAccountSearchFinder(false)}>
          <div className='w-100'>
            <input
              className='w-100'
              type='text'
              onKeyUp={(event) => setInstagramAccountQuerySearch(event.target.value)}
              placeholder='Introduce el usuario de instagram que quieres buscar'
            />
            <button onClick={onClickFindInstagramUser}>Search</button>
          </div>
          <div className='w-100 list-of-similar-accounts-found'>
            <ul className='w-100'>
              {instagramAccountsFound.length > 0 && instagramAccountsFound.map((similarAccount: any) => {
                return (
                  <li
                    key={similarAccount.id}
                    className='w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50'
                  >
                    <div className='flex flex-row'>
                      <div className='flex flex-col pl-4 pr-4'>
                        <img
                          className='rounded-full' src={similarAccount.profilePicUrl}
                          width={60} height={60} alt={similarAccount.username}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <p> <b> {showInstagramAccountVisibility(similarAccount)} @{similarAccount.username}</b> </p>
                        <p><i>{similarAccount?.fullName}</i></p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Modal>}
    </>
  )
}
