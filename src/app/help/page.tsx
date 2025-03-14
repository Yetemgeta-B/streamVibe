'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { 
  QuestionMarkCircleIcon, 
  DevicePhoneMobileIcon, 
  CreditCardIcon, 
  FilmIcon, 
  UserGroupIcon, 
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  topics: string[];
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Manage your account, subscription, and payment methods',
    icon: <CreditCardIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'How to change my password',
      'Update payment method',
      'Cancel subscription',
      'Billing issues',
      'Change email address',
      'Manage profiles'
    ]
  },
  {
    id: 'streaming',
    title: 'Streaming & Playback',
    description: 'Troubleshoot playback issues and improve streaming quality',
    icon: <FilmIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'Fix buffering issues',
      'Improve video quality',
      'Audio problems',
      'Subtitles and captions',
      'Downloading content',
      'Supported devices'
    ]
  },
  {
    id: 'devices',
    title: 'Devices & Apps',
    description: 'Get help with StreamVibe on different devices and platforms',
    icon: <DevicePhoneMobileIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'Smart TV setup',
      'Mobile app troubleshooting',
      'Gaming console setup',
      'Web browser issues',
      'Streaming devices',
      'App updates'
    ]
  },
  {
    id: 'content',
    title: 'Content & Features',
    description: 'Learn about StreamVibe content and special features',
    icon: <ComputerDesktopIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'Content availability',
      'New releases',
      'Recommendations',
      'Parental controls',
      'Watchlist features',
      'Content requests'
    ]
  },
  {
    id: 'family',
    title: 'Family & Sharing',
    description: 'Manage family accounts and profile sharing',
    icon: <UserGroupIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'Family plan setup',
      'Profile management',
      'Kids profiles',
      'Account sharing',
      'Multiple devices',
      'Viewing history'
    ]
  },
  {
    id: 'general',
    title: 'General Help',
    description: 'Find answers to other common questions',
    icon: <QuestionMarkCircleIcon className="h-8 w-8 text-cyan-500" />,
    topics: [
      'Getting started guide',
      'Accessibility features',
      'Privacy concerns',
      'Terms of service',
      'Contact support',
      'Report a bug'
    ]
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCategories = searchQuery 
    ? HELP_CATEGORIES.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : HELP_CATEGORIES;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Help Center
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Find answers to common questions and get support for your StreamVibe experience.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Help Topics</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['Billing Issues', 'Streaming Quality', 'Account Setup', 'Password Reset', 'Device Setup', 'Parental Controls'].map((topic) => (
            <Link 
              key={topic} 
              href={`/help/topic?q=${encodeURIComponent(topic.toLowerCase())}`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors duration-300"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-gray-750 border border-gray-700"
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-4">
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
              </div>
            </div>
            
            <ul className="space-y-2">
              {category.topics.slice(0, 4).map((topic, index) => (
                <li key={index}>
                  <Link 
                    href={`/help/topic?q=${encodeURIComponent(topic.toLowerCase())}`}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center"
                  >
                    <span className="mr-2">•</span>
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link 
              href={`/help/category/${category.id}`}
              className="mt-4 inline-block text-sm text-cyan-500 hover:text-cyan-400 font-medium"
            >
              View all topics →
            </Link>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-16 text-center bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our support team is ready to help you with any questions or issues you might have with StreamVibe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/contact" 
            className="btn-primary inline-flex items-center justify-center"
          >
            Contact Support
          </Link>
          <Link 
            href="/faq" 
            className="btn-secondary inline-flex items-center justify-center"
          >
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
} 