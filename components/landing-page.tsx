"use client";

import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card"; 
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from 'next/image'; 
import { cn } from "@/lib/utils"; // Correct import path for cn utility

// Define images for DraggableCard with positioning
const heroImages = [
  { src: "/hero/extrato.png", alt: "Bank statement example", className: "absolute top-10 left-[20%] rotate-[-5deg] h-[300px] w-[200px] md:h-[360px] md:w-[300px]" },
  { src: "/hero/nubank.png", alt: "Nubank app interface", className: "absolute top-40 left-[35%] rotate-[-7deg] h-[300px] w-[200px] md:h-[360px] md:w-[300px]" },
  { src: "/hero/robinhood.png", alt: "Robinhood app interface", className: "absolute top-5 right-[30%] rotate-[8deg] h-[300px] w-[200px] md:h-[360px] md:w-[300px]" },
  { src: "/hero/spreadsheet.png", alt: "Financial spreadsheet", className: "absolute top-32 right-[15%] rotate-[10deg] h-[300px] w-[200px] md:h-[360px] md:w-[300px]" },
];

export default function LandingPage() {
  return (
    // Main container with background color/gradient
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-black dark:to-slate-900">
      {/* Hero section using HeroHighlight */}
      <HeroHighlight containerClassName="relative flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center space-y-10 px-4">
          {/* Animated title with Highlight */}
          <h1 className="text-center text-5xl font-bold text-slate-800 md:text-6xl lg:text-7xl dark:text-slate-200">
            {/* Fixed title with proper spacing */}
            <span className="whitespace-pre">
              {"Tome Controle Do Seu".split(" ").map((word, index) => (
                <motion.span
                  key={`title1-${index}`}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <br />
            <Highlight className="rounded-md bg-gradient-to-r from-teal-600 to-green-500 px-2 py-1 text-white dark:bg-gradient-to-r dark:from-teal-500 dark:to-green-400">
              <span className="whitespace-pre">
                {"Futuro Financeiro".split(" ").map((word, index) => (
                  <motion.span
                    key={`title2-${index}`}
                    className="inline-block mr-[0.3em]"
                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + index * 0.08,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </Highlight>
          </h1>

          {/* Subtitle with animation */}
          <motion.p
            className="max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Controle seus gastos, ganhe clareza e alcance seus objetivos financeiros com nosso painel intuitivo e inteligente por IA.
          </motion.p>

          {/* CTA Buttons with animation and improved styling */}
          <motion.div
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <SignUpButton mode="modal">
              <button className="transform rounded-lg bg-gradient-to-r from-teal-600 to-green-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black">
                Comece Gratuitamente
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="transform rounded-lg border border-teal-200 bg-white px-8 py-3 text-lg font-semibold text-teal-700 shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:border-teal-800 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700 dark:focus:ring-offset-black">
                Entrar
              </button>
            </SignInButton>
          </motion.div>
        </div>
      </HeroHighlight>

      {/* Draggable Card Section with HeroHighlight for visual consistency */}
      <HeroHighlight containerClassName="relative min-h-[600px] w-full items-center justify-center py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          {/* Section heading with animation */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="inline-block text-4xl font-extrabold md:text-5xl">
              <Highlight className="px-3 py-1 rounded bg-gradient-to-r from-teal-600 to-green-400 text-white dark:from-teal-500 dark:to-green-400">
                Inteligência financeira ao seu alcance
              </Highlight>
            </h2>
            <p className="mt-4 text-xl font-semibold text-teal-700 dark:text-teal-300">
              Transforme sua relação com o dinheiro
            </p>
          </motion.div>

          {/* Background Text - Improved copy and styling */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="font-geist-sans max-w-lg px-4 text-center text-xl font-semibold leading-relaxed text-teal-800 dark:text-teal-100 md:text-2xl tracking-tight">
              <span className="block mb-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-400 drop-shadow-md">
                É muita coisa para você cuidar. Você merece mais. Não tem tempo para isso.
              </span>
              <span className="block mb-6 font-bold underline decoration-green-400/60 decoration-2 underline-offset-4">
                Uma inteligência financeira personalizada <span className="bg-gradient-to-r from-teal-500 to-green-400 bg-clip-text text-transparent">que cuida do seu dinheiro</span>, otimiza seus investimentos e amplia seu patrimônio mês após mês.
              </span>
              <span className="block font-bold italic text-teal-700 dark:text-green-300">
                Quanto mais tranquila seria sua vida se você soubesse exatamente como utilizar seus recursos para construir um futuro financeiro sólido?
              </span>
            </div>
          </motion.div>
          
          {/* Container for the Draggable Cards */}
          <DraggableCardContainer className="relative mx-auto flex min-h-[500px] w-full items-center justify-center overflow-visible px-4">

          {/* Draggable Cards - Absolutely Positioned */}
          {heroImages.map((img, idx) => (
            <DraggableCardBody
              key={idx}
              // Apply individual positioning and base styles
              className={cn(
                img.className, // Positioning/rotation
                "overflow-hidden rounded-xl bg-white/90 p-0 shadow-2xl backdrop-blur-sm ring-1 ring-teal-500/20 dark:bg-slate-800/90 dark:ring-teal-400/20"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                layout="fill" // Use layout fill for responsive sizing within the container
                objectFit="cover" // Cover the area
                className="pointer-events-none h-full w-full"
                priority={idx < 2} // Prioritize first few images
              />
            </DraggableCardBody>
          ))}
          </DraggableCardContainer>

          {/* Call to action at the bottom */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <SignUpButton mode="modal">
              <button className="transform rounded-lg bg-teal-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-teal-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black">
                Comece sua jornada financeira
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </HeroHighlight>

      {/* Optional: Footer or other sections can go here */}

    </div>
  );
}
