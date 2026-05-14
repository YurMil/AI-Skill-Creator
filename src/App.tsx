import { ReactFlowProvider } from '@xyflow/react';
import LibrarySidebar from './components/LibrarySidebar';
import Canvas from './components/Canvas';
import CartSidebar from './components/CartSidebar';
import ConfigPanel from './components/ConfigPanel';

export default function App() {
  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden font-sans relative">
      <LibrarySidebar />
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
      <CartSidebar />
      <ConfigPanel />
    </div>
  );
}
