import React, { useEffect, useState } from 'react'

function TopScorer({ user, rank, filterByYear }) {
    const [colors, setColors] = useState({
        primary: '',
        secondary: '',
    })

    useEffect(() => {
        if (rank === 0) {
            setColors({
                primary: '#52E252',
                secondary: '#32CD32'
            })
        } else if (rank === 1) {
            setColors({
                primary: '#7B72E3',
                secondary: '#584DE2'
            })
        } else if (rank === 2) {
            setColors({
                primary: '#FFCC6F',
                secondary: '#FFA500'
            })
        }
    }, [])
    
    return (
        <div style={{ backgroundColor: colors.primary }} className='text-white font-medium mx-auto w-full rounded-xl flex flex-col items-center'>
            <img className='w-9 aspect-square rounded-full my-2' src={user.img} alt={user.name} />
            <h5>{user.name}</h5>
            <p className='text-sm font-thin'>{user.school}</p>
            <h5 className='font-medium text-2xl my-2'>{filterByYear ? user.progressThisYear + '%' : 'Level ' + user.level}</h5>
            <div style={{ backgroundColor: colors.secondary }} className='w-[80%] rounded-xl py-2 text-center'>
                {rank + 1}<sup>{rank === 0 ? 'er' : 'ème'}</sup>
            </div>
        </div>
    )
}

export default TopScorer