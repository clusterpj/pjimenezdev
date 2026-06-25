import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Contact />
      </main>
    </>
  );
}
