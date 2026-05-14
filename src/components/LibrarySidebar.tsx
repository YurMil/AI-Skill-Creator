import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Plus } from 'lucide-react';

export default function LibrarySidebar() {
  const { baseSkills, loadSkills, addSkillToCanvas } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const filteredSkills = baseSkills.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full bg-slate-50/50">
      <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Skill Library</h2>
        <input 
          type="text"
          placeholder="Search skills..."
          className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => addSkillToCanvas({
            id: `custom-${Math.random().toString(36).substr(2, 6)}`,
            name: 'New Custom Skill',
            description: 'Define your own agent skill.',
            category: 'Custom',
            content: '---\nname: New Custom Skill\ndescription: A custom skill.\n---\n# Instructions\nWrite your agent instructions here...'
          })}
          className="w-full py-2 bg-slate-800 text-white rounded font-medium text-sm hover:bg-slate-700 transition"
        >
          Create Blank Skill
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow group flex flex-col gap-2">
            <div>
              <h3 className="font-medium text-gray-900 text-sm leading-tight">{skill.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{skill.description}</p>
            </div>
            <button 
              onClick={() => addSkillToCanvas(skill)}
              className="flex items-center justify-center gap-1 w-full py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
            >
              <Plus size={14} />
              Add to Canvas
            </button>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">
            No skills found.
          </div>
        )}
      </div>
    </div>
  );
}
