import React from 'react';
import { Play, Book, Users, TrendingUp } from 'lucide-react';

const Dashboard = ({ tools, onToolSelect, onPlayground }) => {
  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-gray-700">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Master DevOps with AI-Guided Learning
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Step-by-step tutorials, interactive playgrounds, and real-world scenarios to become a DevOps expert
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Start Learning</span>
          </button>
          <button className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Browse Guides</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Book className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-gray-400">Tutorials</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Play className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-gray-400">Playgrounds</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-gray-400">Learners</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools by Category */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-6">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(tool => tool.category === category).map(tool => (
              <div
                key={tool.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`${tool.color} p-3 rounded-lg`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">{tool.name}</h4>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-300">Learning Path:</p>
                  <div className="space-y-2">
                    {tool.steps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-400">{step}</span>
                      </div>
                    ))}
                    {tool.steps.length > 3 && (
                      <p className="text-sm text-gray-500">+{tool.steps.length - 3} more steps</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onToolSelect(tool)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Book className="w-4 h-4" />
                    <span>Learn</span>
                  </button>
                  <button
                    onClick={() => onPlayground(tool)}
                    className="flex-1 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Try</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;