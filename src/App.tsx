import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ToolPage from './components/ToolPage';
import SearchResults from './components/SearchResults';
import GuidesPage from './components/GuidesPage';
import Playground from './components/Playground';
import { Search, BookOpen, Code, Play, Home } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const tools = [
    { 
      id: 'docker', 
      name: 'Docker', 
      category: 'Containerization', 
      icon: '🐳', 
      color: 'bg-blue-500',
      steps: ['Installation', 'Basic Commands', 'Dockerfile', 'Images', 'Containers', 'Volumes', 'Networks', 'Docker Compose', 'Registry', 'Best Practices']
    },
    { 
      id: 'kubernetes', 
      name: 'Kubernetes', 
      category: 'Orchestration', 
      icon: '☸️', 
      color: 'bg-blue-600',
      steps: ['Setup', 'Pods', 'Deployments', 'Services', 'ConfigMaps', 'Secrets', 'Ingress', 'Volumes', 'Monitoring', 'Scaling', 'Troubleshooting']
    },
    { 
      id: 'jenkins', 
      name: 'Jenkins', 
      category: 'CI/CD', 
      icon: '🔧', 
      color: 'bg-orange-500',
      steps: ['Installation', 'Configuration', 'Jobs', 'Pipelines', 'Plugins', 'Build Triggers', 'Deployment', 'Integration', 'Security', 'Monitoring', 'Best Practices']
    },
    { 
      id: 'terraform', 
      name: 'Terraform', 
      category: 'Infrastructure', 
      icon: '🏗️', 
      color: 'bg-purple-500',
      steps: ['Installation', 'Configuration', 'Providers', 'Resources', 'Variables', 'Outputs', 'Modules', 'State Management', 'Planning', 'Apply', 'Destroy']
    },
    { 
      id: 'ansible', 
      name: 'Ansible', 
      category: 'Configuration', 
      icon: '⚙️', 
      color: 'bg-red-500',
      steps: ['Installation', 'Inventory', 'Playbooks', 'Tasks', 'Variables', 'Templates', 'Roles', 'Handlers', 'Vault', 'Galaxy', 'Best Practices']
    },
    { 
      id: 'helm', 
      name: 'Helm', 
      category: 'Package Manager', 
      icon: '⎈', 
      color: 'bg-indigo-500',
      steps: ['Installation', 'Charts', 'Values', 'Templates', 'Dependencies', 'Repositories', 'Releases', 'Hooks', 'Testing', 'Packaging', 'Best Practices']
    },
    { 
      id: 'aws', 
      name: 'AWS DevOps', 
      category: 'Cloud', 
      icon: '☁️', 
      color: 'bg-yellow-500',
      steps: ['Setup', 'CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline', 'CloudFormation', 'ECS', 'EKS', 'Lambda', 'Monitoring', 'Security']
    },
    { 
      id: 'monitoring', 
      name: 'Monitoring', 
      category: 'Observability', 
      icon: '📊', 
      color: 'bg-green-500',
      steps: ['Metrics', 'Logging', 'Tracing', 'Alerting', 'Dashboards', 'Prometheus', 'Grafana', 'ELK Stack', 'APM', 'SLI/SLO', 'Incident Response']
    },
    { 
      id: 'security', 
      name: 'Security', 
      category: 'DevSecOps', 
      icon: '🔒', 
      color: 'bg-red-600',
      steps: ['Security Scanning', 'Vulnerability Assessment', 'SAST', 'DAST', 'Container Security', 'Secrets Management', 'Compliance', 'Access Control', 'Audit Logging', 'Incident Response', 'Best Practices']
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = tools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentView('search');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setCurrentView('tool');
  };

  const handlePlaygroundSelect = (tool) => {
    setSelectedTool(tool || tools[0]);
    setCurrentView('playground');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tool':
        return <ToolPage tool={selectedTool} onBack={() => setCurrentView('dashboard')} onPlayground={handlePlaygroundSelect} />;
      case 'search':
        return <SearchResults results={searchResults} onToolSelect={handleToolSelect} onBack={() => setCurrentView('dashboard')} />;
      case 'guides':
        return <GuidesPage tools={tools} onToolSelect={handleToolSelect} onBack={() => setCurrentView('dashboard')} />;
      case 'playground':
        return <Playground tool={selectedTool} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard tools={tools} onToolSelect={handleToolSelect} onBrowseGuides={() => setCurrentView('guides')} onPlayground={handlePlaygroundSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Code className="w-8 h-8" />
                <span>DevOps AI Lab</span>
              </button>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('guides')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'guides' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Guides</span>
                </button>
              </nav>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tools, guides, or commands..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Play className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;