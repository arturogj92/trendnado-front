'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Reel } from '@/app/dto/reel'

const Inspiration = (props: any) => {
  const [reels, setReels] = useState<Reel[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getInspiration(props.searchParams.search)
      .then((reels) => {
        updateReels(reels)
      })
  }, [])

  const updateReels = (reels: Reel[]) => {
    console.log('updateando reels: ', reels)
    reels.forEach((reel: Reel) => {
      reel.videoUrl = getVideoFromProxy(reel.videoUrl)
    })
    console.log('reels[0]', reels[0])
    setLoading(false)
    setReels([...reels])
  }
  const getInspiration = async (userNames: string[]) => {
    console.log('pidiendo reels de: ', userNames)
    // const reels = fetch(`http://localhost:3003/inspiration/${userId}?isMocked=${searchParams.get('isMocked')}`, { next: { revalidate: 10 } })

    const reels = fetch('http://localhost:3003/search-inspiration', {
      method: 'POST',
      body: JSON.stringify(userNames)
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error)
      })

    console.log('los reels son: ', reels)

    return reels
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
            {reels.length > 0 && reels.slice(0, 10).map((post: Reel) => (
              <div key={post.instagramUrl} className=''>
                <video
                  crossOrigin='anonymous' src={post.videoUrl} width={250} height={500}
                  controls
                />
                <p> ❤️ {post.likes} </p>
                <p> ▶️ {post.playCount} </p>
              </div>
            ))}
          </div>
          )}
    </div>
  )
}

export default Inspiration
