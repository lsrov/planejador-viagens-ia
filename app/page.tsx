import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import { PopularList } from "./_components/PopularList";

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularList/>
    </div>
  );
}
