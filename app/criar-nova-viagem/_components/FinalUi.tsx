import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import React from 'react'

function FinalUi({viewTrip, disable}:any) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded">
        <Globe2 className="text-primary text-4xl animate-bounce" />
        <h2 className="mt-3 text-lg font-semibold text-primary">✈️Planejando sua viagem...</h2>
        <p className="text-gray-500 text-sm text-center mt-1">Analisando as melhores opções...</p>
        <Button disabled={disable} onClick={viewTrip} className="mt-2 w-full">Ver viagem</Button>
    </div>
  )
}

export default FinalUi