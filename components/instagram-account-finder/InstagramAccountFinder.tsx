'use client'

import {useState} from 'react'
import '../../public/css/globals.css'
import {Modal} from '@/components/modal/Modal'
import {InstagramAccountOverview} from '@/app/dto/instagram-account-overview'
import {encodeUrl} from '@/shared/url-encoder'
import {SearchInput} from "@/components/search/SearchInput";

export function InstagramAccountFinder({accountFound}) {
    const [showModalInstagramAccountSearchFinder, setShowModalInstagramAccountSearchFinder] = useState(false)
    const [instagramAccountsFound, setInstagramAccountsFound] = useState([])

    const searchInstagramUsers = (instagramAccountQuerySearch: string): Promise<any> => {
        if (instagramAccountQuerySearch.length < 3) return Promise.resolve(null)
        const instagramUsers = fetch(`http://localhost:3003/similar-accounts/search?search_query=${instagramAccountQuerySearch}`, {next: {revalidate: 10}})
        return instagramUsers.then((response) => {
            return response.json()
        })
    }
    const onClickFindInstagramUser = async (text) => {
        updateInstagramAccountsFound([])
        const instagramAccountsSearchResponse = await searchInstagramUsers(text)
        const instagramAccounts = instagramAccountsSearchResponse?.accounts
        instagramAccounts.forEach((instagramAccount: InstagramAccountOverview) => {
            instagramAccount.profilePicUrl = getImageFromProxy(instagramAccount.profilePicUrl)
        })
        updateInstagramAccountsFound(instagramAccounts)
    }

    const updateInstagramAccountsFound = (instagramAccounts: []): void => setInstagramAccountsFound(instagramAccounts)

    const showInstagramAccountVisibility = (instagramAccount: InstagramAccountOverview) => instagramAccount.isPrivate ? '🔒' : ''

    const getImageFromProxy = (videoUrl: string): string => {
        return `http://localhost:3003/proxy?videoUrl="${encodeUrl(videoUrl)}"`
    }

    const accountSelected = (account) => {
        console.log(account)
        if (account.isPrivate) {
            alert('Esta cuenta es privada, no se puede añadir') // TODO: change to toast
            return
        }
        accountFound(account)
    }

    return (
        <>
            <div onClick={() => setShowModalInstagramAccountSearchFinder(true)} className='similar-account-finder'/>
            {
                showModalInstagramAccountSearchFinder &&
              <Modal onClose={() => setShowModalInstagramAccountSearchFinder(false)}>
                <div className='h-20 grid justify-items-stretch'>
                  <SearchInput onClick={(text) => onClickFindInstagramUser(text)}
                               placeholder={'Find an Instagram account'}/>
                </div>
                <div className='h-80 mt-10 overflow-auto w-100 list-of-similar-accounts-found'>
                  <ul className='w-100'>
                      {instagramAccountsFound.length > 0 && instagramAccountsFound.map((instagramAccount: any) => {
                          return (
                              <li
                                  onClick={() => accountSelected(instagramAccount)}
                                  key={instagramAccount.id}
                                  className='w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:text-white'
                              >
                                  <div className='w-full flex justify-start'>
                                      <div className='pl-4 pr-4'>
                                          <img
                                              className='rounded-full' src={instagramAccount.profilePicUrl}
                                              width={60} height={60} alt={instagramAccount.username}
                                          />
                                      </div>
                                      <div className=''>
                                          <p>
                                              <b> @{instagramAccount.username}</b> {showInstagramAccountVisibility(instagramAccount)}
                                          </p>
                                          <p><i>{instagramAccount?.fullName}</i></p>
                                      </div>

                                  </div>
                              </li>
                          )
                      })}
                  </ul>
                </div>
              </Modal>
            }
        </>
    )
}
