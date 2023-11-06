'use client'

import React from 'react'
import '../../public/css/globals.css'

// @ts-ignore
export function SimilarAccountOverview ({ account, isSelected }) {
  const handleClassName = () => {
    return isSelected ? 'border-blue selected' : ''
  }

  return (
    <>
      <div key={account.instagramUrl}>
        <div>
          <img
            className={'avatar rounded-full ' + handleClassName()}
            src={account.profilePicUrl} width={120} height={120}
            alt={account.username}
          />
        </div>
        <p> {account.username} </p>
        <p> 🧑‍🤝‍🧑 {account.followers}</p>
      </div>
    </>
  )
}
