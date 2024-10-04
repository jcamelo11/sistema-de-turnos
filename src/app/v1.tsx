"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { motion, AnimatePresence } from "framer-motion"
import { Clock3 } from 'lucide-react';




// Simulated data for turns
const turnsData = [
  { name: "Jhonatan David Camelo", module: "Módulo 1" },
  { name: "Luis Fernández", module: "Módulo 3" },
  { name: "Carmen Torres", module: "Módulo 2" },
  { name: "Pedro Ramírez", module: "Módulo 4" },
  { name: "Diego Jiménez", module: "Módulo 1" },
  { name: "Laura Díaz", module: "Módulo 2" },
  { name: "Fernando Muñoz", module: "Módulo 3" },
  { name: "Paula Suárez", module: "Módulo 1" },
  { name: "Ricardo Ortiz", module: "Módulo 2" },
  { name: "Natalia Castillo", module: "Módulo 3" },
  { name: "Alejandro Morales", module: "Módulo 4" },
  { name: "Julia Herrera", module: "Módulo 1" },
  { name: "Jorge Vega", module: "Módulo 2" },
  { name: "Marta Ruiz", module: "Módulo 3" },
  { name: "Esteban Aguirre", module: "Módulo 4" },
  { name: "Claudia Moreno", module: "Módulo 1" },
  { name: "Héctor Gil", module: "Módulo 2" },
  { name: "Jhonatan David Camelo Paredes", module: "Módulo 3" },
]

// Clock component
const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center items-center text-2xl font-bold text-center p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg text-gray-800 dark:text-gray-200">
      <Clock3 className="w-7 h-7 mr-2 text-indigo-600 dark:text-indigo-400" />
      <span className="">
        {time.toLocaleTimeString()}
      </span>
    </div>
  )
}


export default function Component() {
  const [turns, setTurns] = useState(turnsData)
  const [currentTurn, setCurrentTurn] = useState(turns[0])
  const [isNewTurn, setIsNewTurn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/bell-sound.mp3") // Asegúrate de tener este archivo en tu carpeta public
  }, [])

  // Function to speak the current turn
  const speakTurn = (turn: { name: string; module: string }) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(` ${turn.name}, ${turn.module}`)
      utterance.lang = 'es-ES' // Set language to Spanish
      speechSynthesis.speak(utterance)
    }
  }

  // Simulate turn changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTurns(prevTurns => {
        const [first, ...rest] = prevTurns
        return [...rest, first]
      })
      setIsNewTurn(true)
      // Play bell sound
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error))
      }
      setTimeout(() => setIsNewTurn(false), 2000) // Reset animation after 1 second
    }, 5000) // Change turn every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Update current turn when turns change and speak the new turn
  useEffect(() => {
    setCurrentTurn(turns[0])
    speakTurn(turns[0])
  }, [turns])
  

  

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left section - Carousel and Clock */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col">
        <Carousel className="w-full flex-grow rounded-xl overflow-hidden shadow-2xl mb-4">
          <CarouselContent>
            <CarouselItem>
              <img src="https://images.pexels.com/photos/5622251/pexels-photo-5622251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Anuncio 1" className="w-full h-full object-cover" />
            </CarouselItem>
            <CarouselItem>
              <img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/d506ec201724337.667a16b3dfc0d.jpg" alt="Anuncio 2" className="w-full h-full object-cover" />
            </CarouselItem>
            <CarouselItem>
              <video className="w-full h-full object-cover" controls autoPlay muted>
                <source src="https://videos.pexels.com/video-files/4487290/4487290-uhd_2560_1440_25fps.mp4" />
                Tu navegador no soporta el tag de video.
              </video>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        <Clock />
      </div>

      {/* Right section - Turn information */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col">
        <Card className="flex-grow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Turno Actual</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTurn.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10 relative"
              >
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isNewTurn ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-purple-200 dark:from-purple-400 opacity-50"
                />
                <motion.div
                  animate={{ scale: isNewTurn ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2 relative z-10">{currentTurn.name}</p>
                  <p className="text-3xl text-indigo-600 dark:text-indigo-400 relative z-10">{currentTurn.module}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Turnos Anteriores</h3>
            <ul className="space-y-3">
              {turns.slice(1, 6).reverse().map((turn, index) => (
                <motion.li
                  key={turn.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-800"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{turn.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{turn.module}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}