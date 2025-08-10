"use client"
import { sugestoes } from '@/app/_components/Hero'
import React from 'react'
import { Globe2, Landmark, Plane, MapPin, Calendar, Users, DollarSign } from 'lucide-react'

// Sugestões específicas para criação de viagem
const sugestoesViagem = [
    {
        title: 'Para onde vou?',
        icon: (hovered: boolean) => <MapPin className={`h-5 w-5 ${hovered ? 'text-white' : 'text-blue-400'}`}/>
    },
    {
        title: 'Quando viajar?',
        icon: (hovered: boolean) => <Calendar className={`h-5 w-5 ${hovered ? 'text-white' : 'text-green-400'}`}/>
    },
    {
        title: 'Com quem?',
        icon: (hovered: boolean) => <Users className={`h-5 w-5 ${hovered ? 'text-white' : 'text-purple-400'}`}/>
    },
    {
        title: 'Qual orçamento?',
        icon: (hovered: boolean) => <DollarSign className={`h-5 w-5 ${hovered ? 'text-white' : 'text-yellow-400'}`}/>
    },
    ...sugestoes // Inclui as sugestões originais também
]

interface EmptyBoxStateProps {
    onSugestaoClick?: (texto: string) => void;
}

function EmptyBoxState({ onSugestaoClick }: any) {
  return (
    <div className='mt-7'>
        <h2 className="font-bold text-3xl text-center">Vamos planejar uma <strong className='text-primary'>viagem</strong>?</h2>
        <p className="text-center text-gray-600 mt-2 mb-6">Escolha uma sugestão ou escreva sua própria mensagem</p>
        <div className="flex gap-3 justify-center flex-wrap">
            {sugestoesViagem.map((sugestao,index)=>(
                <SugestaoItem 
                    key={index} 
                    sugestao={sugestao} 
                    onClick={() => onSugestaoClick?.(sugestao.title)}
                />
            ))}
        </div>
    
    </div>
  )
}

function SugestaoItem({
    sugestao,
    onClick
}:{
    sugestao:{title:string,icon:(hovered:boolean)=>React.ReactNode},
    onClick?: () => void
}){
    const [hovered,setHovered]=React.useState(false);
    return (
        <div
            className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors"
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
            onClick={onClick}
        >
            {sugestao.icon(hovered)}
            <h2 className="text-sm">{sugestao.title}</h2>
        </div>
    )
}

export default EmptyBoxState