import { ChevronDown, ChevronUp } from 'lucide-react';

const AdminSection = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div>
      <div 
        className={`flex items-center justify-between px-3 mb-2 ${onToggle ? 'cursor-pointer' : ''}`}
        onClick={onToggle}
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        {onToggle && (
          <button className="text-gray-500 hover:text-gray-300">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default AdminSection;
