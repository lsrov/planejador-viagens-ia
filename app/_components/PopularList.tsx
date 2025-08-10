"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Destinos populares:
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
              loading="lazy"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
    {
        category: "Paris, França",
        title: "Explore a Cidade das Luzes – Torre Eiffel, Louvre e muito mais",
        src: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8fDA%3D",
        content: <DummyContent />,
    },
    {
        category: "Nova York, EUA",
        title: "Viva NYC - Times Square, Central Park, Broadway",
        src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Tóquio, Japão",
        title: "Descubra Tóquio - Shibuya, Cerejeiras, Templos",
        src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2070&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Roma, Itália",
        title: "Caminhe pela História - Coliseu, Vaticano, Fórum Romano",
        src: "https://images.unsplash.com/photo-1634633848589-ed77ac089881?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29saXNldW18ZW58MHx8MHx8fDA%3D",
        content: <DummyContent />,
    },
    {
        category: "Dubai, EAU",
        title: "Luxo e Inovação - Burj Khalifa, Safari no Deserto",
        src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Sydney, Austrália",
        title: "Vistas do Porto - Opera House, Bondi Beach e Vida Selvagem",
        src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop",
        content: <DummyContent />,
    },
];
