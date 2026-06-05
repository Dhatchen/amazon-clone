import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import your new component

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Our New Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet /> 
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} Amazon Clone Platform. Built with React & Node.</p>
      </footer>
    </div>
  );
};

export default MainLayout;