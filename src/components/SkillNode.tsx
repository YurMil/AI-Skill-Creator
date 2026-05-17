import { Handle, Position } from '@xyflow/react';
import { useAppStore } from '../store';
import { useState } from 'react';
import { FileEdit, X, ShoppingCart } from 'lucide-react';

export default function SkillNode({ id, data }: any) {
  const { setEditingNodeId, removeNode, addToCart } = useAppStore();

  const handleAddToCart = () => {
    addToCart({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      content: data.content,
      cartId: id + '-' + Math.random().toString(36).substr(2, 6)
    });
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg w-80 relative flex flex-col overflow-hidden group">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      
      <div className="bg-blue-50/50 p-3 border-b border-blue-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-950 leading-none">{data.name}</h3>
          <span className="text-[10px] text-blue-600 font-medium tracking-wide uppercase">{data.category}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditingNodeId(id)} className="p-1 hover:bg-blue-100 rounded text-blue-700">
            <FileEdit size={14} />
          </button>
          <button onClick={() => removeNode(id)} className="p-1 hover:bg-red-100 rounded text-red-500">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-3 bg-white nodrag cursor-default">
         <p className="text-xs text-gray-600 line-clamp-2">{data.description}</p>
      </div>

      <div className="p-2 border-t border-gray-50 bg-gray-50 flex justify-end">
         <button onClick={handleAddToCart} className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors">
            <ShoppingCart size={12} />
            Pack Skill
         </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}
