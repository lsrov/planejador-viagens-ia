import React from 'react'

export const SelectTravelesList = [
    {
        id: 1,
        title: 'Somente Eu',
        desc: 'Um viajante solitário',
        icon: '🧍‍♂️',
        people: '1'
    },
    {
        id: 2,
        title: 'Em dupla',
        desc: 'Viajando a dois',
        icon: '👫',
        people: '2 Pessoas'
    },
    {
        id: 3,
        title: 'Familia',
        desc: 'Família unida em viagem',
        icon: '🏡',
        people: '3 a 5 Pessoas'
    },
    {
        id: 4,
        title: 'Amigos',
        desc: 'Aventura com amigos',
        icon: '⛺',
        people: '5 a 10 Pessoas'
    },
]

function GroupSizeUi({onSelectedOption}:any) {

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gaps-2 items-center mt-1'>
        {SelectTravelesList.map((item,index) => (
            <div key={index} className='p-3 border rounded-2xl bg-white
            hover:border-primary cursor-pointer'
            onClick={() => onSelectedOption(item.title+":"+item.people)}
            >
                <h2>{item.icon}</h2>
                <h2>{item.title}</h2>
            </div>
        ))}
    </div>
  )
}

export default GroupSizeUi