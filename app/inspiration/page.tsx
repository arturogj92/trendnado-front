'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Reel } from '@/app/dto/reel'
import {Loading} from "@/components/loading/Loading";

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
    reels.forEach((reel: Reel) => {
      reel.videoUrl = getVideoFromProxy(reel.videoUrl)
    })
    setLoading(false)
    setReels([...reels])
  }
  const getInspiration = async (userNames: string[]) => {

    const reels = fetch('http://localhost:3003/search-inspiration', {
      method: 'POST',
      body: JSON.stringify(userNames)
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error)
      })

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
              <Loading/>
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
