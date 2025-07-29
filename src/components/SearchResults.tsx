import React from 'react';
import { Search, X } from 'lucide-react';

const SearchResults = ({ query, results, onToolSelect, onClearSearch }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-gray-400">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        </div>
        <button
          onClick={onClearSearch}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
          <p className="text-gray-500">Try searching for Docker, Kubernetes, CI/CD, or other DevOps tools</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(tool => (
            <div
              key={tool.id}
              onClick={() => onToolSelect(tool)}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className={`${tool.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">{tool.name}</h4>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-300">Matching content:</p>
                <div className="space-y-2">
                  {tool.steps.filter(step => 
                    step.toLowerCase().includes(query.toLowerCase())
                  ).slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-400">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;