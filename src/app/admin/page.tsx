'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FilmIcon, 
  TvIcon, 
  UserIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const MOCK_MOVIES = [
  { id: 1, title: 'The Matrix', status: 'Published', views: 12453, rating: 4.8 },
  { id: 2, title: 'Inception', status: 'Published', views: 9876, rating: 4.7 },
  { id: 3, title: 'Interstellar', status: 'Published', views: 8765, rating: 4.9 },
  { id: 4, title: 'The Dark Knight', status: 'Draft', views: 0, rating: 0 },
  { id: 5, title: 'Pulp Fiction', status: 'Published', views: 7654, rating: 4.6 },
];

const MOCK_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium', joined: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Basic', joined: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', plan: 'Premium', joined: '2023-03-10' },
];

type Tab = 'dashboard' | 'movies' | 'tvshows' | 'users' | 'settings';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Simulate loading data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Admin Dashboard</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-800">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyan-600">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <p className="font-medium">{session?.user?.name || 'Admin User'}</p>
            <p className="text-sm text-gray-400">{session?.user?.email || 'admin@example.com'}</p>
          </div>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('movies')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'movies' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <FilmIcon className="h-5 w-5 mr-3" />
                Movies
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('tvshows')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'tvshows' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <TvIcon className="h-5 w-5 mr-3" />
                TV Shows
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <CogIcon className="h-5 w-5 mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          <Link
            href="/"
            className="block text-center py-2 px-4 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Back to Site
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 p-6">
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as Tab)}
            className="w-full p-2 bg-gray-900 text-white rounded border border-gray-700"
          >
            <option value="dashboard">Dashboard</option>
            <option value="movies">Movies</option>
            <option value="tvshows">TV Shows</option>
            <option value="users">Users</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              <button
                onClick={refreshData}
                className="flex items-center px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                disabled={isLoading}
              >
                <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Movies</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div className="p-3 bg-cyan-900/30 rounded-full">
                    <FilmIcon className="h-6 w-6 text-cyan-500" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-500">
                  +12% from last month
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total TV Shows</p>
                    <p className="text-2xl font-bold">867</p>
                  </div>
                  <div className="p-3 bg-purple-900/30 rounded-full">
                    <TvIcon className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-500">
                  +8% from last month
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">24,512</p>
                  </div>
                  <div className="p-3 bg-blue-900/30 rounded-full">
                    <UserIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-500">
                  +18% from last month
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">$124,500</p>
                  </div>
                  <div className="p-3 bg-green-900/30 rounded-full">
                    <ChartBarIcon className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-500">
                  +24% from last month
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recent Movies</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {MOCK_MOVIES.slice(0, 5).map((movie) => (
                        <tr key={movie.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{movie.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              movie.status === 'Published' ? 'bg-green-900/30 text-green-500' : 'bg-yellow-900/30 text-yellow-500'
                            }`}>
                              {movie.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{movie.views.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {MOCK_USERS.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                              </div>
                              <div>
                                <div>{user.name}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.plan === 'Premium' ? 'bg-purple-900/30 text-purple-500' : 'bg-blue-900/30 text-blue-500'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(user.joined).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Movies Management</h1>
              <button className="flex items-center px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Movie
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {MOCK_MOVIES.map((movie) => (
                      <tr key={movie.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{movie.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            movie.status === 'Published' ? 'bg-green-900/30 text-green-500' : 'bg-yellow-900/30 text-yellow-500'
                          }`}>
                            {movie.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {movie.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            {movie.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 rounded hover:bg-gray-700">
                              <PencilIcon className="h-5 w-5 text-blue-500" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-700">
                              <TrashIcon className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">42</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded bg-cyan-600 text-white hover:bg-cyan-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TV Shows Tab */}
        {activeTab === 'tvshows' && (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">TV Shows Management</h1>
            <p className="text-gray-400 mb-8">This section is under development.</p>
            <button className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors">
              Coming Soon
            </button>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">User Management</h1>
              <button className="flex items-center px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {MOCK_USERS.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.plan === 'Premium' ? 'bg-purple-900/30 text-purple-500' : 'bg-blue-900/30 text-blue-500'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(user.joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 rounded hover:bg-gray-700">
                              <PencilIcon className="h-5 w-5 text-blue-500" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-700">
                              <TrashIcon className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">24,512</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded bg-cyan-600 text-white hover:bg-cyan-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue="StreamVibe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Site Description</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    defaultValue="Stream your favorite movies and TV shows anytime, anywhere."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Maintenance Mode</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenance-mode"
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-700 rounded bg-gray-800"
                    />
                    <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-300">
                      Enable maintenance mode
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">API Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">TMDB API Key</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue="••••••••••••••••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">API Request Limit</label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>1000 requests/day</option>
                    <option>5000 requests/day</option>
                    <option>10000 requests/day</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-gray-700 rounded mr-3 hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 