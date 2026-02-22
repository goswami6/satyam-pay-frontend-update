import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
