'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is StreamVibe?',
    answer: 'StreamVibe is a premium movie and TV show streaming platform that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.'
  },
  {
    question: 'How much does StreamVibe cost?',
    answer: 'Watch StreamVibe on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $15.99 a month. No extra costs, no contracts.'
  },
  {
    question: 'Where can I watch?',
    answer: 'Watch anywhere, anytime. Sign in with your StreamVibe account to watch instantly on the web at streamvibe.com from your personal computer or on any internet-connected device that offers the StreamVibe app, including smart TVs, smartphones, tablets, streaming media players and game consoles.'
  },
  {
    question: 'How do I cancel?',
    answer: 'StreamVibe is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.'
  },
  {
    question: 'What can I watch on StreamVibe?',
    answer: 'StreamVibe has an extensive library of feature films, documentaries, TV shows, anime, award-winning StreamVibe originals, and more. Watch as much as you want, anytime you want.'
  },
  {
    question: 'Is StreamVibe good for kids?',
    answer: 'The StreamVibe Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see.'
  },
  {
    question: 'Why am I seeing this title in a different language?',
    answer: 'Your content language settings might be set to a different language. You can change this in your account settings. Also, some titles are only available in certain languages based on licensing agreements.'
  },
  {
    question: 'Can I download movies to watch offline?',
    answer: 'Yes! With our Premium plan, you can download movies and TV shows to watch offline on up to 5 devices. This feature is perfect for traveling or when you have limited internet access.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Find answers to common questions about StreamVibe, our services, billing, and more.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-left">{item.question}</h3>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-cyan-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-cyan-500" />
                )}
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-gray-300">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
} 