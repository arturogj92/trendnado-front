'use client'

import React from "react";
import {router} from "next/client";

const redirectToSimilarAccount = async (username: string) => {
    console.log('heeey', username)
    // change url to /analysis/:username
    await router.push(`/analysis/${username}?isMocked=true`)
}


export function SimilarAccountOverview ({ account }) {
    return (
        <>
            <div key={account.instagramUrl} className=''>
                <img
                    onClick={() => redirectToSimilarAccount(account.username)}
                    src={account.profilePicUrl} width={250} height={500}
                    alt={account.username}/>
                <p> {account.username} </p>
                <p> ❤️ {account.followers}</p>
                <p> 🧑‍🤝‍🧑 1</p>
            </div>
        </>
    )
}
