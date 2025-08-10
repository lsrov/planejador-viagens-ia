"use client"
import React, { useRef, useState } from 'react'
import ChatBox, { TripInfo } from './_components/ChatBox'
import SuggestionsPanel from './_components/SuggestionsPanel'
import { useSuggestions } from './_components/useSuggestions'

function CriarNovaViagem() {
  const chatBoxRef = useRef<{ setInputValue: (value: string) => void }>(null);

  return (
    <div className="flex justify-center items-center p-10">
      <ChatBox ref={chatBoxRef} />
    </div>
  );
}

export default CriarNovaViagem