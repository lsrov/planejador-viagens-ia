"use client"
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const sugestoes=[
    {
        title:'Criar Nova Viagem',
        //Se eu passar o mouse em cima do botão, o texto e o ícone ficam brancos. Se tirar, voltam para a cor original
        icon: (hovered: boolean) => <Globe2 className={`h-5 w-5 ${hovered ? 'text-white' : 'text-orange-400'}`}/>
    },
    {
        title:'Me inspire',
        icon: (hovered: boolean) => <Plane className={`h-5 w-5 ${hovered ? 'text-white' : 'text-green-400'}`}/>
    },
    {
        title:'Descubra',
        icon: (hovered: boolean) => <Landmark className={`h-5 w-5 ${hovered ? 'text-white' : 'text-pink-400'}`}/>
    },
    {
        title:'Próxima Aventura',
        icon: (hovered: boolean) => <Globe2 className={`h-5 w-5 ${hovered ? 'text-white' : 'text-yellow-400'}`}/>
    },
]

const Hero = () => {

    const {user}=useUser();
    const router=useRouter();
    const onSend=()=>{
        if(!user){ //Se eu clicar no botão de enviar no box de prompt sem estar logado, o site me redireciona para o login
            router.push('/sign-in')
            return ;
        }
        router.push('/criar-nova-viagem');
    }

  return (
    <div className="mt-24 flex flex-col items-center space-y-8">
        {/* Título - Largura total */}
        <div className="w-full text-center">
            <h1 className="text-xl md:text-5xl font-bold">Sua viagem com facilidade e segurança com o <span className="text-primary">Planejador de Viagens</span>!</h1>
        </div>
        
        {/* Descrição - Largura limitada */}
        <div className="max-w-3xl w-full text-center">
            <p className="text-lg">Me diga o que você quer e eu farei o resto: voos, hoteis, planejar a sua viagem...</p>
        </div>
        
    {/* Box de input removido conforme solicitado */}
        
        {/* Lista de sugestões */}
        <div className="flex gap-5">
            {sugestoes.map((sugestao,index)=>(
                <SugestaoItem key={index} sugestao={sugestao} />
            ))}
        </div>

        <h2 className="my-7 mt-14 flex gap-2">Não sabe por onde começar? <strong>Veja o vídeo abaixo e veja como funciona</strong> <ArrowDown/></h2>
        
        {/* Sessão do vídeo */}
        <div className="relative">
        <HeroVideoDialog
            className="block"
            animationStyle="from-center"
            videoSrc="https://www.example.com/dummy-video"
            thumbnailSrc="https://i.ytimg.com/vi/vZdYo_1Pwz8/maxresdefault.jpg"
            thumbnailAlt="Dummy Video Thumbnail"
        />
        </div>
    </div>
  )
}

export default Hero

function SugestaoItem({sugestao}:{sugestao:{title:string,icon:(hovered:boolean)=>React.ReactNode}}){
    const [hovered,setHovered]=React.useState(false);
    return (
        <div
            className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors"
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
        >
            {sugestao.icon(hovered)}
            <h2 className="text-sm">{sugestao.title}</h2>
        </div>
    )
}