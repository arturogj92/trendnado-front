'use client'
import React, { useEffect, useState } from 'react'
import { SimilarAccount } from '@/app/dto/similar-account'
import { SimilarAccountOverview } from '@/components/similar-account-overview/SimilarAccountOverview'
import Link from 'next/link'
import { Loading } from '@/components/loading/Loading'
import { InstagramAccountFinder } from '@/components/instagram-account-finder/InstagramAccountFinder'
import { encodeUrl } from '@/shared/url-encoder'

const SimilarAccounts = (props: any) => {
  const [similarAccounts, setSimilarAccounts] = useState<SimilarAccount[]>([])
  const [selectedSimilarAccounts, setSelectedSimilarAccounts] = useState<SimilarAccount[]>([])

  const handleSelectedSimilarAccount = (similarAccount: SimilarAccount) => {
    // add only if not already in the list and if exists, delete it
    if (selectedSimilarAccounts.find((selectedSimilarAccount) => selectedSimilarAccount.userId === similarAccount.userId)) {
      setSelectedSimilarAccounts(selectedSimilarAccounts.filter((selectedSimilarAccount) => selectedSimilarAccount.userId !== similarAccount.userId))
    } else {
      setSelectedSimilarAccounts([...selectedSimilarAccounts, similarAccount])
    }
  }

  const handleRemoveSimilarAccount = (account: SimilarAccount) => {
    // remove similar account from similaraccounts and selectedsimilaraccounts only if exists
    if (similarAccounts.find((similarAccount) => similarAccount.userId === account.userId)) {
      setSimilarAccounts(similarAccounts.filter((similarAccount) => similarAccount.userId !== account.userId))
    }
    if (selectedSimilarAccounts.find((selectedSimilarAccount) => selectedSimilarAccount.userId === account.userId)) {
      setSimilarAccounts(similarAccounts.filter((selectedSimilarAccount) => selectedSimilarAccount.userId !== account.userId))
    }

  }

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getSimilarAccountsFrom(props.params.creatorName)
      .then((similarAccounts) => {
        updateSimilarAccounts(similarAccounts)
      })
  }, [])

  const updateSimilarAccounts = (similarAccounts: SimilarAccount[]) => {
    similarAccounts.forEach((reel: SimilarAccount) => {
      reel.profilePicUrl = getVideoFromProxy(reel.profilePicUrl)
    })
    setLoading(false)
    setSimilarAccounts([...similarAccounts])
  }

  const getSimilarAccountsFrom = async (userName: string) => {
    const similarAccounts = fetch(`http://localhost:3003/similar-accounts/${userName}`, { next: { revalidate: 10 } })
    return similarAccounts.then((response) => {
      return response.json()
    })
  }

  const getVideoFromProxy = (videoUrl: string): string => {
    return `http://localhost:3003/proxy?videoUrl="${encodeUrl(videoUrl)}"`
  }

  const isSelectedSimilarAccount = (similarAccount: SimilarAccount) =>
    selectedSimilarAccounts.find((selectedSimilarAccount) => selectedSimilarAccount.userId === similarAccount.userId)

  const addNewInstagramAccountToSimilar = (instagramAccount: any) => {
    console.log('instagramAccount selected', instagramAccount)
    if (similarAccounts.find((similarAccount) => similarAccount.userId === instagramAccount.userId)) {
      alert('Ya has añadido esta cuenta!') // TODO: change to toast
      return
    }
    setSimilarAccounts([instagramAccount, ...similarAccounts])
    setSelectedSimilarAccounts([instagramAccount, ...selectedSimilarAccounts])
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <>
            <div className='grid grid-cols-5 gap-4'>
              <InstagramAccountFinder accountFound={(account) => addNewInstagramAccountToSimilar(account)}/>
              {similarAccounts.length > 0 && similarAccounts.slice(0, 30).map((similarAccount: SimilarAccount) => (
                <div key={similarAccount.userId}>
                  <SimilarAccountOverview
                    account={similarAccount}
                    key={similarAccount.username}
                    isSelected={isSelectedSimilarAccount(similarAccount)}
                    onClick={() => handleSelectedSimilarAccount(similarAccount)}
                    onRemove={() => handleRemoveSimilarAccount(similarAccount)}
                  />
                </div>
              ))}
              <Link href={{
                pathname: '/inspiration',
                query: {
                  search: selectedSimilarAccounts.map((selectedSimilarAccount) => selectedSimilarAccount.userId)
                }
              }}
              >
                <button className='text-white bg-blue-700 hover:bg-blue-800 p-4'> INSPIRAME </button>
              </Link>
            </div>
          </>
          )}

    </div>
  )
}

export default SimilarAccounts
