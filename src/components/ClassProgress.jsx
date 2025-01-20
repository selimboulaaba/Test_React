import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ClassProgress({ classe }) {
    return (
        <div className='flex items-center justify-between mt-2 mx-6 border-2 border-[#584DE2] px-4 py-3 rounded-xl'>
            <div className='font-medium'>
                <div className='text-[#584DE2]'>{classe.name}</div>
                <span className='text-[#464444]'>{classe.nbrStudents} Elèves</span>
            </div>
            <CircularProgressbar value={classe.progress} text={`${classe.progress}%`} className='w-16' styles={buildStyles({
                strokeLinecap: 'butt',
                textSize: '30px',
                trailColor: '#DEDBFF',
                pathColor: `#584DE2`,
                textColor: '#584DE2',
            })} />
        </div>
    )
}

export default ClassProgress