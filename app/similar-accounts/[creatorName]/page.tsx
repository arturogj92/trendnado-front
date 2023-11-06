'use client'
import React, {useEffect, useState} from 'react'
import {SimilarAccount} from '@/app/dto/similar-account'
import {SimilarAccountOverview} from '@/components/similar-account-overview/SimilarAccountOverview'
import Link from 'next/link'
import {Loading} from "@/components/loading/Loading";

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

    console.log('similarAccounts GLOBAL', selectedSimilarAccounts)

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
        console.log('similarAccounts[0]', similarAccounts[0])
        setLoading(false)
        setSimilarAccounts([...similarAccounts])
    }

    const getSimilarAccountsFrom = async (userName: string) => {
        console.log('pidiendo similarAccounts de: ', userName)
        const similarAccounts = fetch(`http://localhost:3003/similar-accounts/${userName}`, {next: {revalidate: 10}})
        console.log('los similarAccounts son: ', similarAccounts)
        return similarAccounts.then((response) => {
            console.log('response: ', response)
            return response.json()
        })
    }

    const encodedUrl = (videoUrl: string) => {
        const encodeAmpersand: string = videoUrl.replaceAll('&', 'ENCODED_AMPERSAND')
        const encodePercent = encodeAmpersand.replaceAll('%', 'ENCODED_PERCENT')
        return encodePercent
    }

    const getVideoFromProxy = (videoUrl: string): string => {
        return `http://localhost:3003/proxy?videoUrl="${encodedUrl(videoUrl)}"`
    }

    const isSelectedSimilarAccount = (similarAccount: SimilarAccount) =>
        selectedSimilarAccounts.find((selectedSimilarAccount) => selectedSimilarAccount.userId === similarAccount.userId)

  const isSelectedSimilarAccountClassNameCalculator = (similarAccount: SimilarAccount) => {
    return isSelectedSimilarAccount(similarAccount) ? 'border-4 border-red-500' : ''
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {isLoading
        ? (
          <Loading/>
          )
        : (
          <>
            <div className='grid grid-cols-5 gap-4'>
              {similarAccounts.length > 0 && similarAccounts.slice(0, 30).map((similarAccount: SimilarAccount) => (
                <div key={similarAccount.userId} >
                  <SimilarAccountOverview
                      account={similarAccount}
                      key={similarAccount.username}
                      isSelected={isSelectedSimilarAccount(similarAccount)}
                      onClick={() => handleSelectedSimilarAccount(similarAccount)}
                  />
                </div>
              ))}
              <Link href={{
                pathname: '/inspiration',
                query: {
                  search: selectedSimilarAccounts.map((selectedSimilarAccount) => selectedSimilarAccount.username)
                }
              }}
              >
                <button className={"text-white bg-blue-700 hover:bg-blue-800 p-4"}> INSPIRAME PUTO </button>
              </Link>

            </div>
          </>
          )}

        </div>
    )
}

export default SimilarAccounts
