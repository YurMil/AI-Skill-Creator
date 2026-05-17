import { useAppStore } from '../store';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Skill } from '../types';

export default function ConfigPanel() {
  const { editingNodeId, setEditingNodeId, nodes, updateNodeContent, updateNodeDetails } = useAppStore();
  
  const editingNode = nodes.find(n => n.id === editingNodeId);
  const data = editingNode?.data as Partial<Skill> | undefined;

  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    if (data) {
      setTempName(data.name || '');
      setTempDescription(data.description || '');
      setTempContent(data.content || '');
    }
  }, [data, editingNodeId]);

  if (!editingNodeId || !data) return null;

  const handleSave = () => {
    updateNodeDetails(editingNodeId, { name: tempName, description: tempDescription });
    updateNodeContent(editingNodeId, tempContent);
    setEditingNodeId(null);
  };

  return (
    <div className="absolute right-72 top-4 bottom-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-8">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">Configure Skill</h2>
        <button onClick={() => setEditingNodeId(null)} className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Skill Name</label>
          <input 
            type="text" 
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none h-20"
            value={tempDescription}
            onChange={e => setTempDescription(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-medium text-gray-700 mb-1">Agent Instructions / MD Content</label>
          <textarea 
            className="w-full flex-1 min-h-[200px] text-xs font-mono p-3 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
            value={tempContent}
            onChange={e => setTempContent(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
        <button onClick={() => setEditingNodeId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
