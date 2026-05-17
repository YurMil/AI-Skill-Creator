import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useReactFlow } from '@xyflow/react';
import { useAppStore } from '../store';
import SkillNode from './SkillNode';
import '@xyflow/react/dist/style.css';
import { Combine } from 'lucide-react';

const nodeTypes = {
  skillNode: SkillNode,
};

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, combineSelectedNodes, setEditingNodeId } = useAppStore();
  const { getNodes } = useReactFlow();
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isCombining, setIsCombining] = useState(false);
  const [combinedName, setCombinedName] = useState('');

  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    setSelectedNodes(nodes.map(n => n.id));
  }, []);

  const onNodeDoubleClick = useCallback((_: any, node: any) => {
    setEditingNodeId(node.id);
  }, [setEditingNodeId]);

  const handleCombine = () => {
    if (combinedName.trim()) {
      combineSelectedNodes(selectedNodes, combinedName);
      setIsCombining(false);
      setCombinedName('');
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-50 relative">
      <div className="absolute top-4 left-6 z-10 select-none pointer-events-none">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Agent Skill Crafter</h1>
        <p className="text-sm border-l-2 border-blue-500 pl-2 text-gray-500 mt-1 max-w-sm">
          Drag and drop skills from the library. Connect them visually. Select multiple nodes to combine into complex capability stacks.
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onSelectionChange={onSelectionChange}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <Background gap={16} size={1} color="var(--canvas-grid)" />
        <Controls />
      </ReactFlow>

      {selectedNodes.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-3 px-4 z-10 animate-in slide-in-from-top-4">
          <span className="text-sm font-medium text-gray-700">{selectedNodes.length} nodes selected</span>
          <div className="w-px h-4 bg-gray-200"></div>
          {isCombining ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="New Skill Name..." 
                className="text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={combinedName}
                onChange={e => setCombinedName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleCombine()}
              />
              <button onClick={handleCombine} className="text-sm font-medium text-blue-700 hover:text-blue-800 px-2">Store</button>
              <button onClick={() => setIsCombining(false)} className="text-sm text-gray-500 hover:text-gray-700 px-2">Cancel</button>
            </div>
          ) : (
            <button 
              onClick={() => setIsCombining(true)}
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <Combine size={14} />
              Combine into Stack
            </button>
          )}
        </div>
      )}
    </div>
  );
}
