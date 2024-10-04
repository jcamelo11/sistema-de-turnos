"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from 'embla-carousel-react'
import { Clock3 } from 'lucide-react';

// Simulated data for turns
const turnsData = [
  { name: "Juan Pérez", module: "Módulo 3" },
  { name: "Kenia Flores Osuna", module: "Módulo 3" },
  { name: "María García", module: "Módulo 1" },
  { name: "Carlos Alberto Mejía", module: "Módulo 2" },
  { name: "Ana Martínez", module: "Módulo 4" },
  { name: "Jhonatan David Camelo", module: "Módulo 1" },
]

// Clock component
const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center items-center text-2xl font-bold text-center p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg text-gray-800 dark:text-gray-200">
    <Clock3 className="w-7 h-7 mr-2 text-indigo-600 dark:text-indigo-400" />
    <span className="">
      {time.toLocaleTimeString()}
    </span>
  </div>
  )
}

// Custom Carousel component
const AutoPlayCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  useEffect(() => {
    const autoPlay = () => {
      if (emblaApi) {
        const currentSlide = emblaApi.selectedScrollSnap()
        const isVideo = emblaApi.slideNodes()[currentSlide].querySelector('video')
        
        if (isVideo) {
          if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play()
          }
        } else {
          setTimeout(() => {
            emblaApi.scrollNext()
          }, 5000) // Change slide every 5 seconds for images
        }
      }
    }

    autoPlay()

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [emblaApi, currentIndex])

  const handleVideoEnded = () => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }

  return (
    <div className="w-full flex-grow rounded-xl overflow-hidden shadow-2xl mb-4" ref={emblaRef}>
      <div className="flex">
        <div className="flex-[0_0_100%] min-w-0">
          <img src="images/prom.png" alt="Anuncio 1" className="w-full h-full object-cover" />
        </div>
        <div className="flex-[0_0_100%] min-w-0">
          <img src="images/prom2.png" alt="Anuncio 2" className="w-full h-full object-cover" />
        </div>
        <div className="flex-[0_0_100%] min-w-0">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover" 
            onEnded={handleVideoEnded}
            muted
          >
            <source src="https://videos.pexels.com/video-files/4352123/4352123-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Tu navegador no soporta el tag de video.
          </video>
        </div>
      </div>
    </div>
  )
}

const DotAnimation = ({ text }: { text: string }) => {
  const particleCount = 30
  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981']

  return (
    <div className="relative">
      {[...Array(particleCount)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: colors[index % colors.length] }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.2, 1],
            delay: Math.random() * 0.2,
          }}
        />
      ))}
      <motion.p
        className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2 relative z-10"
        aria-live="assertive"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {text}
      </motion.p>
    </div>
  )
}

export default function Component() {
  const [turns, setTurns] = useState(turnsData)
  const [currentTurn, setCurrentTurn] = useState(turns[0])
  const [isNewTurn, setIsNewTurn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/bell-sound.mp3")
  }, [])

  const speakTurn = (turn: { name: string; module: string }) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Turno actual: ${turn.name}, ${turn.module}`)
      utterance.lang = 'es-ES'
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTurns(prevTurns => {
        const [first, ...rest] = prevTurns
        return [...rest, first]
      })
      setIsNewTurn(true)
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error))
      }
      setTimeout(() => setIsNewTurn(false), 2000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCurrentTurn(turns[0])
    speakTurn(turns[0])
  }, [turns])

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full lg:w-1/2 p-6 flex flex-col">
        <AutoPlayCarousel />
        <Clock />
      </div>
      <div className="w-full lg:w-1/2 p-6 flex flex-col">
        <Card className="flex-grow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Turno Actual</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTurn.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-10 relative"
              >
                <DotAnimation text={currentTurn.name} />
                <motion.p 
                  className="text-3xl text-indigo-600 dark:text-indigo-400 relative z-10" 
                  aria-live="assertive"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.7 }}
                >
                  {currentTurn.module}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Turnos Anteriores</h3>
            <ul className="space-y-3">
              {turns.slice(1).map((turn, index) => (
                <motion.li
                  key={turn.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
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