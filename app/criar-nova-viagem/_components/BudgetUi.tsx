import React from 'react'
import { SelectTravelesList } from './GroupSizeUi'

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Barato',
        desc: 'Estou com orçamento limitado',
        icon: '💵',
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 2,
        title: 'Médio',
        desc: 'Deixe os custos controlados',
        icon: '💰',
        color: 'bg-yellow-100 text-yellow-600'
    },
    {
        id: 3,
        title: 'Luxo',
        desc: 'Não se preocupe com o custo',
        icon: '💸',
        color: 'bg-purple-100 text-purple-600'
    },
]

function BudgetUi({onSelectedOption}:any) {
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gaps-2 items-center mt-1'>
            {SelectBudgetOptions.map((item, index) => (
                <div key={index} className='p-3 border rounded-2xl bg-white
                hover:border-primary cursor-pointer'
                    onClick={() => onSelectedOption(item.title + ":" + item.desc)}
                >
                    <div className='text-3xl p-3 rounded-full'>{item.icon}</div>
                    <h2 className='text-lg font-semibold mt-2'>{item.title}</h2>
                </div>
            ))}
        </div>
    )
}

export default BudgetUi