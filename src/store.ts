import { create } from 'zustand';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import { Skill, ConfiguredSkill } from './types';
import { nanoid } from 'nanoid';

type SkillNodeData = Skill & {
  onAdd?: () => void;
};

interface AppState {
  // Base Data
  baseSkills: Skill[];
  setBaseSkills: (skills: Skill[]) => void;
  loadSkills: () => Promise<void>;

  // React Flow State
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Canvas Actions
  addSkillToCanvas: (skill: Skill, position?: {x: number, y: number}) => void;
  updateNodeContent: (nodeId: string, newContent: string) => void;
  updateNodeDetails: (nodeId: string, updates: Partial<Skill>) => void;
  removeNode: (nodeId: string) => void;
  clearCanvas: () => void;
  
  // Configuration UI
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;

  // Cart / Bag
  cart: ConfiguredSkill[];
  addToCart: (skill: ConfiguredSkill) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  
  // Crafting / Combining
  combineSelectedNodes: (selectedNodeIds: string[], newSkillName: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  baseSkills: [],
  setBaseSkills: (skills) => set({ baseSkills: skills }),
  loadSkills: async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      set({ baseSkills: data.skills });
    } catch (e) {
      console.error("Failed to fetch skills", e);
    }
  },

  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addSkillToCanvas: (skill, position = { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }) => {
    const newNode: Node = {
      id: nanoid(),
      type: 'skillNode',
      position,
      data: { 
        ...skill,
        onAdd: () => {
          const currentNode = get().nodes.find(n => n.id === newNode.id);
          const currentContent = (currentNode?.data as Partial<SkillNodeData> | undefined)?.content;
          get().addToCart({
            ...skill,
            cartId: nanoid(),
            content: currentContent || skill.content,
          });
        }
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeContent: (nodeId, newContent) => {
    set({
      nodes: get().nodes.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, content: newContent } } 
          : node
      )
    });
  },

  updateNodeDetails: (nodeId, updates) => {
    set({
      nodes: get().nodes.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updates } } 
          : node
      )
    });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter(n => n.id !== nodeId),
      edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [] });
  },

  editingNodeId: null,
  setEditingNodeId: (id) => set({ editingNodeId: id }),

  cart: [],
  addToCart: (skill) => {
    set({ cart: [...get().cart, skill] });
  },
  removeFromCart: (cartId) => {
    set({ cart: get().cart.filter(s => s.cartId !== cartId) });
  },
  clearCart: () => {
    set({ cart: [] });
  },

  combineSelectedNodes: (selectedNodeIds, newSkillName) => {
    const { nodes } = get();
    const selected = nodes.filter(n => selectedNodeIds.includes(n.id));
    if (selected.length === 0) return;

    let combinedContent = `---\nname: ${newSkillName}\ndescription: Auto-combined skill set.\n---\n\n`;
    selected.forEach((node, index) => {
      const skillData = node.data as unknown as SkillNodeData;
      combinedContent += `### Included Skill ${index + 1}: ${skillData.name}\n${skillData.content}\n\n`;
    });

    const newSkill: Skill = {
      id: `custom-${nanoid(5)}`,
      name: newSkillName,
      description: `Combined skills: ${selected.map(n => (n.data as unknown as SkillNodeData).name).join(', ')}`,
      category: "Custom",
      content: combinedContent
    };
    // Add new skill back to canvas as a single node
    get().addSkillToCanvas(newSkill);
  }
}));
