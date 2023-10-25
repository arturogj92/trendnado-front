'use client'
import React, {useEffect, useState} from 'react'
import {SimilarAccount} from "@/app/dto/similar-account";
import {SimilarAccountOverview} from '@/components/similar-account-overview/SimilarAccountOverview'


const SimilarAccounts = (props: any) => {
  const [similarAccounts, setSimilarAccounts] = useState<SimilarAccount[]>([])
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
    const similarAccounts = fetch(`http://localhost:3003/similar-accounts/${userName}`, { next: { revalidate: 10 } })
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

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {isLoading
        ? (
          <div><span>Loading...</span>
            <img alt='alien' src='https://i.imgur.com/SVR7Jgj.gif' />
          </div>
          )
        : (
          <div className='grid grid-cols-5 gap-4'>
            {similarAccounts.length > 0 && similarAccounts.map((similarAccount: SimilarAccount) => (
             <SimilarAccountOverview account={similarAccount}></SimilarAccountOverview>
            ))}
          </div>
          )}
    </div>
  )
}

export default SimilarAccounts
