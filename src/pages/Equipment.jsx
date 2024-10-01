import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import '../vehicle.css';

const EquipmentEntry = () => {
    const adminId = localStorage.getItem('adminId') || '';
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const navigate = useNavigate();
    const adminLevel = localStorage.getItem('adminLevel');

    useEffect(() => {
        if (adminLevel !== '1') {
            localStorage.clear();
            navigate('/');
        }
    }, [adminLevel, navigate]);

    useEffect(() => {
        fetchEquipments();
    }, []);

    const fetchEquipments = async () => {
        setLoading(true);
        const url = "http://localhost/coc/gsd/user.php";
        const jsonData = { operation: "fetchEquipments" };

        try {
            const response = await axios.post(url, new URLSearchParams(jsonData));
            if (response.data.status === 'success') {
                setEquipments(response.data.data);
            } else {
                toast.error("Error fetching equipments: " + response.data.message);
            }
        } catch (error) {
            console.error("Error fetching equipments:", error);
            toast.error("An error occurred while fetching equipments.");
        } finally {
            setLoading(false);
        }
    };

    const filteredEquipments = equipments.filter(equipment =>
        equipment.equip_name && equipment.equip_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEquipment = currentPage * entriesPerPage;
    const indexOfFirstEquipment = indexOfLastEquipment - entriesPerPage;
    const currentEquipments = filteredEquipments.slice(indexOfFirstEquipment, indexOfLastEquipment);
    const totalPages = Math.ceil(filteredEquipments.length / entriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <div className="flex-grow ml-0 lg:ml-10 p-6">
                <h2 className="text-2xl font-bold">Equipment Entry</h2>
                <div className="flex flex-col lg:flex-row items-center mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="border border-gray-300 p-2 rounded w-full max-w-xs"
                    />
                    <button onClick={fetchEquipments} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
                        <FaSearch className="mr-2" /> Search
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">No.</th>
                                <th className="py-3 px-6 text-left">Equipment Name</th>
                                <th className="py-3 px-6 text-left">Equipment Quantity</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Equipment Created</th>
                                <th className="py-3 px-6 text-left">Equipment Updated</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {currentEquipments.length > 0 ? (
                                currentEquipments.map((equipment, index) => (
                                    <tr key={equipment.equip_id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6">{indexOfFirstEquipment + index + 1}</td>
                                        <td className="py-3 px-6">{equipment.equip_name}</td>
                                        <td className="py-3 px-6">{equipment.equip_quantity}</td>
                                        <td className="py-3 px-6">{equipment.equip_status}</td>
                                        <td className="py-3 px-6">{equipment.equip_created_at}</td>
                                        <td className="py-3 px-6">{equipment.equip_updated_at}</td>
                                        <td className="py-3 px-6">
                                            <button className="text-blue-500">Edit</button>
                                            <button className="text-red-500 ml-2">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-3">NO EQUIPMENTS FOUND</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <span>Page {currentPage} of {totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default EquipmentEntry;
