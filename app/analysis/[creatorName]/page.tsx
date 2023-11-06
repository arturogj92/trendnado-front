'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Reel } from '@/app/dto/reel'

const Analysis = (props: any) => {
  const [reels, setReels] = useState<Reel[]>([])
  const [isLoading, setLoading] = useState(true)

  const searchParams = useSearchParams()

  useEffect(() => {
    getBestReels(props.params.creatorName)
      .then((reels) => {
        updateReels(reels)
      })
  }, [])

  const updateReels = (reels: Reel[]) => {
    reels.forEach((reel: Reel) => {
      reel.videoUrl = getVideoFromProxy(reel.videoUrl)
    })
    setLoading(false)
    setReels([...reels])
  }
  const getBestReels = async (userId: string) => {
    const reels = fetch(`http://localhost:3003/reels/${userId}?isMocked=${searchParams.get('isMocked')}`, { next: { revalidate: 10 } })
    return reels.then((response) => {
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

export default Analysis
