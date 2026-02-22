import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path }) => {
  return (
    <NavLink
      to={path}
      end={path === '/dashboard/payments'}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
