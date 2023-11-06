'use client'

import React from 'react'
import './globals.css'
import { SimilarAccount } from '@/app/dto/similar-account'

// @ts-ignore
export function SimilarAccountOverview ({ account, isSelected, onClick }) {
  const handleClassName = () => {
    return isSelected ? 'border-blue selected' : ''
  }

  console.log('selected: ', isSelected)

  return (
    <>
      <div key={account.instagramUrl}>
        <div>
          <img
            onClick={onClick}
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
