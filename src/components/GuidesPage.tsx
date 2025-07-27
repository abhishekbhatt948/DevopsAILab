import React, { useState } from 'react';
import { ArrowLeft, Book, ExternalLink, Search, Filter, ChevronRight } from 'lucide-react';

const GuidesPage = ({ tools, onToolSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState(null);

  const categories = ['all', ...new Set(tools.map(tool => tool.category))];

  const officialDocs = {
    docker: {
      title: 'Docker Official Documentation',
      url: 'https://docs.docker.com/',
      description: 'Complete Docker documentation with installation guides, tutorials, and reference materials.',
      sections: [
        'Get Started with Docker',
        'Docker Desktop',
        'Docker Engine',
        'Docker Compose',
        'Docker Hub',
        'Docker Build',
        'Docker Swarm'
      ]
    },
    kubernetes: {
      title: 'Kubernetes Official Documentation',
      url: 'https://kubernetes.io/docs/',
      description: 'Comprehensive Kubernetes documentation covering concepts, tutorials, and reference guides.',
      sections: [
        'Getting Started',
        'Concepts',
        'Tutorials',
        'Tasks',
        'Reference',
        'Setup and Installation',
        'Troubleshooting'
      ]
    },
    jenkins: {
      title: 'Jenkins User Documentation',
      url: 'https://www.jenkins.io/doc/',
      description: 'Official Jenkins documentation with installation, configuration, and usage guides.',
      sections: [
        'Installing Jenkins',
        'Using Jenkins',
        'Managing Jenkins',
        'Pipeline',
        'Blue Ocean',
        'System Administration',
        'Tutorials'
      ]
    },
    terraform: {
      title: 'Terraform Documentation',
      url: 'https://developer.hashicorp.com/terraform/docs',
      description: 'HashiCorp Terraform documentation with tutorials, guides, and reference materials.',
      sections: [
        'Get Started',
        'Language (HCL)',
        'CLI Commands',
        'Configuration',
        'Providers',
        'Modules',
        'Cloud Integration'
      ]
    },
    helm: {
      title: 'Helm Documentation',
      url: 'https://helm.sh/docs/',
      description: 'Official Helm documentation for Kubernetes package management.',
      sections: [
        'Introduction',
        'Quickstart Guide',
        'Using Helm',
        'Chart Development',
        'Chart Repository',
        'Helm Commands',
        'Best Practices'
      ]
    },
    ansible: {
      title: 'Ansible Documentation',
      url: 'https://docs.ansible.com/',
      description: 'Red Hat Ansible documentation with installation, configuration, and playbook guides.',
      sections: [
        'Getting Started',
        'Installation Guide',
        'User Guide',
        'Playbooks',
        'Modules',
        'Collections',
        'Best Practices'
      ]
    },
    aws: {
      title: 'AWS DevOps Documentation',
      url: 'https://docs.aws.amazon.com/devops/',
      description: 'Amazon Web Services documentation for DevOps tools and services.',
      sections: [
        'CodeCommit',
        'CodeBuild',
        'CodeDeploy',
        'CodePipeline',
        'CloudFormation',
        'ECS',
        'EKS'
      ]
    }
  };

  const additionalGuides = [
    {
      id: 'gitops',
      title: 'GitOps Methodology',
      category: 'Best Practices',
      description: 'Learn GitOps principles and implementation strategies',
      topics: ['GitOps Principles', 'ArgoCD', 'Flux', 'Git Workflows', 'Security']
    },
    {
      id: 'microservices',
      title: 'Microservices Architecture',
      category: 'Architecture',
      description: 'Design and deploy microservices with DevOps practices',
      topics: ['Service Mesh', 'API Gateway', 'Service Discovery', 'Circuit Breakers', 'Observability']
    },
    {
      id: 'sre',
      title: 'Site Reliability Engineering',
      category: 'Best Practices',
      description: 'SRE principles, SLIs, SLOs, and error budgets',
      topics: ['SLI/SLO/SLA', 'Error Budgets', 'Incident Management', 'Postmortems', 'Monitoring']
    },
    {
      id: 'cloudnative',
      title: 'Cloud Native Technologies',
      category: 'Architecture',
      description: 'CNCF landscape and cloud-native application development',
      topics: ['CNCF Projects', 'Service Mesh', 'Serverless', 'Container Runtime', 'Storage']
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredGuides = additionalGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedGuide) {
    const doc = officialDocs[selectedGuide];
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedGuide(null)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{doc.title}</h1>
            <p className="text-gray-400">{doc.description}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Official Documentation</h2>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Official Docs</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doc.sections.map((section, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{section}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Interactive Learning</h2>
          <p className="text-gray-400 mb-4">
            Ready to practice? Try our interactive tutorials and playground for hands-on learning.
          </p>
          <button
            onClick={() => {
              const tool = tools.find(t => t.id === selectedGuide);
              if (tool) onToolSelect(tool);
            }}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Interactive Tutorial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">DevOps Learning Guides</h1>
            <p className="text-gray-400">Comprehensive documentation and learning resources</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search guides and documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Documentation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Official Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => {
            const doc = officialDocs[tool.id];
            if (!doc) return null;
            
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedGuide(tool.id)}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`${tool.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-400 text-sm">{doc.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Key Sections:</p>
                  <div className="space-y-1">
                    {doc.sections.slice(0, 3).map((section, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-400">{section}</span>
                      </div>
                    ))}
                    {doc.sections.length > 3 && (
                      <p className="text-sm text-gray-500">+{doc.sections.length - 3} more sections</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-blue-400">View Documentation</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Learning Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                  <p className="text-gray-400 text-sm">{guide.description}</p>
                </div>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                  {guide.category}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Topics Covered:</p>
                <div className="flex flex-wrap gap-2">
                  {guide.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
            <Book className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-medium mb-1">Cheat Sheets</h3>
            <p className="text-sm text-gray-400">Quick reference guides for all tools</p>
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
            <ExternalLink className="w-6 h-6 text-green-400 mb-2" />
            <h3 className="font-medium mb-1">External Resources</h3>
            <p className="text-sm text-gray-400">Curated links to blogs and tutorials</p>
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
            <Search className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-medium mb-1">Community Q&A</h3>
            <p className="text-sm text-gray-400">Get help from the community</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;