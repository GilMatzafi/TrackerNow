"use client";

import { useState, useEffect } from 'react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "The way to get started is to quit talking and begin doing.",
  "Innovation distinguishes between a leader and a follower.",
  "Life is what happens to you while you're busy making other plans.",
  "The time is always right to do what is right.",
  "In the middle of difficulty lies opportunity.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it."
];

export default function MotivationalQuotesCard() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentIndex(randomIndex);
      setCurrentQuote(motivationalQuotes[randomIndex]);
      setDisplayText('');
      setIsTyping(true);
    }, 10000);

    // Set initial quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentIndex(randomIndex);
    setCurrentQuote(motivationalQuotes[randomIndex]);
    setIsTyping(true);

    return () => clearInterval(interval);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || !currentQuote) return;

    let currentCharIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentCharIndex <= currentQuote.length) {
        setDisplayText(currentQuote.slice(0, currentCharIndex));
        currentCharIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50); // Adjust speed here (lower = faster)

    return () => clearInterval(typingInterval);
  }, [currentQuote, isTyping]);

  return (
    <div className="bg-black rounded-3xl p-8 shadow-sm border border-gray-800">
      <div className="relative">
        <p 
          className="text-white text-5xl leading-relaxed min-h-[120px] font-handwriting"
          style={{
            fontFamily: "'Patrick Hand', 'Caveat', 'Shadows Into Light', cursive",
            lineHeight: '1.6'
          }}
        >
          {displayText}
          {isTyping && (
            <span className="animate-pulse text-yellow-400">|</span>
          )}
        </p>
      </div>
    </div>
  );
}
