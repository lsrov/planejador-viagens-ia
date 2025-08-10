"use client"

// Botão de alternância claro/escuro
function ThemeToggleButton() {
    const [dark, setDark] = React.useState(false);
    React.useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);
    return (
        <button
            onClick={() => setDark((d) => !d)}
            style={{
                marginLeft: 16,
                padding: "8px 18px",
                borderRadius: "999px",
                background: dark ? "#222" : "#fff",
                color: dark ? "#fff" : "#222",
                border: dark ? "1px solid #444" : "1px solid #ccc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "all 0.2s"
            }}
        >
            {dark ? "🌙 Escuro" : "☀️ Claro"}
        </button>
    );
}
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'

const opcoesMenu=[
    {
        name:'Home',
        path:'/'
    },
    {
        name:'Preços',
        path:'precos'
    },
    {
        name:'Contato',
        path:'/contato'
    }
    
]

const Header = () => {

    const {user}=useUser();

  return (
    <div className='flex items-center justify-between p-4'>
        {/*Logo + Theme*/}
        <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
                <h1 className='text-2xl font-bold'>Planejador de viagens</h1>
            </a>
            <ThemeToggleButton />
        </div>
        {/* ...outros elementos do header, como menu, login, etc... */}

        {/*Menu Centralizado*/}
        <div className='flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2'>
            {opcoesMenu.map((menu, index) => (
                <Link href={menu.path} key={index}>
                <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
                </Link>
            ))}
        </div>

        {/*Botao*/}
        {!user ? (
            <SignInButton mode="modal">
                <Button>Iniciar</Button>
            </SignInButton>
        ) : (
            typeof window !== 'undefined' && window.location.pathname === '/criar-nova-viagem' ? (
                <Image src={user.imageUrl || '/logo.svg'} alt="avatar" width={40} height={40} className="rounded-full" />
            ) : (
                <Link href={'/criar-nova-viagem'}>
                    <Button>Criar Nova Viagem</Button>
                </Link>
            )
        )}
    </div>
  )
}

export default Header