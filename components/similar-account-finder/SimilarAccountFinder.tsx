'use client'

import {useEffect, useState} from 'react'
import '../../public/css/globals.css'
import {Modal} from "@/components/modal/Modal";
import {SimilarAccount} from "@/app/dto/similar-account";
import {encodeUrl} from "@/shared/url-encoder";

// @ts-ignore
export function SimilarAccountFinder({onSelected}) {

    const [showModalSimilarAccountFinder, setShowModalSimilarAccountFinder] = useState(false)
    const [similarAccountQuerySearch, setSimilarAccountQuerySearch] = useState('')
    const [similarAccountsFound, setSimilarAccountsFound] = useState([{}] as any)

    const findSimilarAccounts = (similarAccountQuerySearch: string): Promise<any> => {
        if (similarAccountQuerySearch.length < 3) return Promise.resolve(null);
        console.log('Searching similar accounts with: ', similarAccountQuerySearch);
        const similarAccounts = fetch(`http://localhost:3003/similar-accounts/search?search_query=${similarAccountQuerySearch}`, {next: {revalidate: 10}})
        console.log('los similarAccounts encontrados son: ', similarAccounts)
        return similarAccounts.then((response) => {
            console.log('response: ', response)
            return response.json()
        })
    }
    const onClickFindSimilarAccounts = async () => {
        const similarAccountsResponse = await findSimilarAccounts(similarAccountQuerySearch)
        const similarAccounts = similarAccountsResponse?.similarAccounts
        console.log(similarAccountQuerySearch, similarAccounts);
        similarAccounts.forEach((similarAccount: SimilarAccount) => {
            similarAccount.profilePicUrl = getImageFromProxy(similarAccount.profilePicUrl)
        })
        updateSimilarAccountsFound(similarAccounts)
    }

    const updateSimilarAccountsFound = (similarAccounts: {}): void => setSimilarAccountsFound(similarAccounts)

    const showSimilarAccountVisibility = (similarAccount: SimilarAccount) => similarAccount.isPrivate ? '🔒' : '🔓'

    const getImageFromProxy = (videoUrl: string): string => {
        return `http://localhost:3003/proxy?videoUrl="${encodeUrl(videoUrl)}"`
    }

    return (
        <>
            <div onClick={() => setShowModalSimilarAccountFinder(true)} className={'similar-account-finder'}></div>
            {showModalSimilarAccountFinder &&
              <Modal onClose={() => setShowModalSimilarAccountFinder(false)}>
                <div className={'w-100'}>
                  <input
                    className={'w-100'}
                    type={'text'}
                    onKeyUp={(event) => setSimilarAccountQuerySearch(event.target['value'])}
                    placeholder={'Search similar accounts...'}/>
                  <button onClick={onClickFindSimilarAccounts}>Search</button>
                </div>
                <div className={'w-100 list-of-similar-accounts-found'}>
                  <ul className="w-100">
                      {similarAccountsFound && similarAccountsFound.map((similarAccount: any) => {
                          return <li
                              key={similarAccount.id}
                              className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50">
                              <div className={'flex flex-row'}>
                                  <div className={'flex flex-col pl-4 pr-4'}>
                                      <img className={'rounded-full'} src={similarAccount.profilePicUrl}
                                           width={60} height={60} alt={similarAccount.username}/>
                                  </div>
                                  <div className={'flex flex-col'}>
                                      <p> <b> {showSimilarAccountVisibility(similarAccount)} @{similarAccount.username}</b> </p>
                                      <p><i>{similarAccount?.fullName}</i></p>
                                      <p> 🧑‍🤝‍🧑 {similarAccount.followers}</p>
                                  </div>
                              </div>
                          </li>
                      })
                      }
                  </ul>
                </div>
              </Modal>
            }
        </>
    )
}

