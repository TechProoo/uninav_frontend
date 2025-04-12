import About from "@/components/About";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <footer className="w-full bg-[var(--bg-dark)] text-white text-center py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Build Minds. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
