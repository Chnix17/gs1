import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTachometerAlt, FaCar, FaCog, FaFileAlt, FaHeadset, FaChevronDown, FaBars, FaHome, FaTools, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMasterFileOpen, setMasterFileOpen] = useState(false);
  const [isReservationOpen, setReservationOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const adminName = localStorage.getItem('adminName') || '';

  const toggleMasterFile = () => {
    setMasterFileOpen(!isMasterFileOpen);
  };

  const toggleReservations = () => {
    setReservationOpen(!isReservationOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear(); // Clear local storage
    window.location.reload(); // Force a full page reload
  };

  return (
    <div className="flex">
      <button className="lg:hidden p-2" onClick={toggleSidebar}>
        <FaBars className="text-white" />
      </button>
      <aside className={`fixed h-full bg-gray-800 text-white shadow-lg transition-transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-16'} lg:translate-x-0 lg:w-64`}>
        <div className="sidebar-header p-5 text-center bg-gray-700 border-b border-gray-600">
          <div className="flex items-center justify-center mb-2">
            <FaUserCircle className="text-3xl" />
          </div>
          <h1 className={`text-xl font-bold ${isSidebarOpen ? '' : 'hidden'}`}>{adminName}</h1>
          <p className={`text-sm ${isSidebarOpen ? '' : 'hidden'}`}>admin@example.com</p>
        </div>
        <nav className="sidebar-nav p-5">
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                <FaTachometerAlt className="mr-3" /> {isSidebarOpen ? 'Dashboard' : ''}
              </Link>
            </li>
            <li className="mb-4">
              <div onClick={toggleMasterFile} className="flex items-center cursor-pointer p-2 hover:bg-blue-600 rounded transition">
                <FaFileAlt className="mr-3" /> {isSidebarOpen ? 'Master File' : ''}
                <FaChevronDown className={`ml-auto transition-transform ${isMasterFileOpen ? 'rotate-180' : ''}`} />
              </div>
              {isMasterFileOpen && (
                <ul className="ml-4 mt-2 bg-gray-700 rounded shadow-md">
                  <li className="mb-2">
                    <Link to="/Venue" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                      <FaHome className="mr-2" /> {isSidebarOpen ? 'Venue' : ''}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/VehicleEntry" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                      <FaCar className="mr-2" /> {isSidebarOpen ? 'Vehicle' : ''}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/Equipment" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                      <FaTools className="mr-2" /> {isSidebarOpen ? 'Equipments' : ''}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="mb-4">
              <Link to="/User" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                <FaUserCircle className="mr-3" /> {isSidebarOpen ? 'Users' : ''}
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/settings" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                <FaCog className="mr-3" /> {isSidebarOpen ? 'Settings' : ''}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/support" className="flex items-center p-2 hover:bg-blue-600 rounded transition">
                <FaHeadset className="mr-3" /> {isSidebarOpen ? 'Support' : ''}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout p-5 border-t border-gray-600">
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:bg-red-600 p-2 rounded transition w-full">
            <FaSignOutAlt className="mr-3" /> {isSidebarOpen ? 'Logout' : ''}
          </button>
        </div>
      </aside>
      <div className={`flex-grow transition-all ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
