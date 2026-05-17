import { useAppStore } from '../store';
import { X, Download, Archive, Trash2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CartSidebar() {
  const { cart, removeFromCart, clearCart } = useAppStore();

  const handleDownloadZip = async () => {
    if (cart.length === 0) return;
    
    const zip = new JSZip();
    const skillsFolder = zip.folder("skills");

    if (!skillsFolder) return;

    cart.forEach(skill => {
      // Slugify the name for a clean folder name
      const folderName = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const skillDir = skillsFolder.folder(folderName);
      if (skillDir) {
        skillDir.file("SKILL.md", skill.content);
        // We could also add a manifest or other supporting files if needed
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "agent_skills.zip");
  };

  return (
    <div className="w-72 border-l border-gray-200 bg-white flex flex-col h-full bg-slate-50/50 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Archive size={16} className="text-gray-500" />
          Skill Pack ({cart.length})
        </h2>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-[10px] uppercase font-bold tracking-wider text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map(skill => (
          <div key={skill.cartId} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 relative group">
            <button 
              onClick={() => removeFromCart(skill.cartId)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded hidden group-hover:block transition-colors"
            >
              <X size={14} />
            </button>
            <div className="pr-6">
              <h3 className="font-medium text-gray-900 text-sm">{skill.name}</h3>
              <p className="text-[10px] text-gray-400 font-mono mt-1 w-full truncate border border-dashed border-gray-200 bg-gray-50 p-1 rounded">
                /skills/{skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              </p>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Archive size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 mb-2">Your skill pack is empty.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <button
          disabled={cart.length === 0}
          onClick={handleDownloadZip}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download size={16} />
          Download .ZIP
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
          Unpack the zip archive into your agent's skills directory. Compatible with common agent skill formats.
        </p>
      </div>
    </div>
  );
}
