import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import '../vehicle.css';

const VehicleEntry = () => {
    const adminId = localStorage.getItem('adminId') || '';
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [makes, setMakes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicles();
        fetchCategories();
    }, []);

    useEffect(() => {
        const results = vehicles.filter(vehicle =>
            vehicle.model_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVehicles(results);
        setCurrentPage(1); // Reset to the first page on search
    }, [searchTerm, vehicles]);

    const fetchVehicles = async () => {
        setLoading(true);
        const url = "http://localhost/coc/gsd/user.php";
        const jsonData = { operation: "fetchVehicles" };

        try {
            const response = await axios.post(url, new URLSearchParams(jsonData));
            if (response.data.status === 'success') {
                setVehicles(response.data.data);
                setFilteredVehicles(response.data.data); // Initialize filtered vehicles
            } else {
                toast.error("Error fetching vehicles: " + response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching vehicles.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const url = "http://localhost/coc/gsd/user.php";
        const jsonData = { operation: "fetchCategories" };

        try {
            const response = await axios.post(url, new URLSearchParams(jsonData));
            if (response.data.status === 'success') {
                setCategories(response.data.data);
            } else {
                toast.error("Error fetching categories: " + response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching categories.");
        }
    };

    const fetchMakesByCategory = async (categoryId) => {
        const url = "http://localhost/coc/gsd/user.php";
        const jsonData = { operation: "fetchMakesByCategory", categoryId };

        try {
            const response = await axios.post(url, new URLSearchParams(jsonData));
            if (response.data.status === 'success') {
                setMakes(response.data.data);
            } else {
                toast.error("Error fetching makes: " + response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching makes.");
        }
    };

    const handleAddVehicle = () => {
        resetForm();
        setShowModal(true);
        setEditMode(false);
    };

    const handleEditVehicle = (vehicle) => {
        setVehicleModel(vehicle.model_name);
        setVehicleCategory(vehicle.category_id);
        setVehicleMake(vehicle.vehicle_make_id);
        setSelectedVehicle(vehicle);
        setShowModal(true);
        setEditMode(true);
        fetchMakesByCategory(vehicle.category_id);
    };

    const handleDeleteVehicle = async (vehicleId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
        if (confirmDelete) {
            const url = "http://localhost/coc/gsd/user.php";
            const jsonData = { operation: "deleteVehicle", vehicle_id: vehicleId };

            try {
                const response = await axios.post(url, new URLSearchParams(jsonData));
                if (response.data.status === 'success') {
                    toast.success("Vehicle successfully deleted!");
                    await fetchVehicles();
                } else {
                    toast.error("Failed to delete vehicle: " + response.data.message);
                }
            } catch (error) {
                toast.error("An error occurred while deleting the vehicle.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!vehicleModel || !vehicleCategory || !vehicleMake) {
            toast.error("All fields are required!");
            return;
        }
    
        const vehicleData = {
            model_name: vehicleModel,   // Match with PHP parameter
            admin_id: adminId,          // Match with PHP parameter
            make_id: vehicleMake,       // Match with PHP parameter
        };
    
        const formData = new FormData();
        formData.append("operation", editMode ? "updateVehicleModel" : "saveVehicleModel");
        formData.append("json", JSON.stringify({ ...vehicleData }));
    
        setLoading(true);
        try {
            const url = "http://localhost/coc/gsd/user.php";
            const response = await axios.post(url, formData);
            if (response.data.status === 'success') {
                toast.success(`Vehicle model successfully ${editMode ? "updated" : "added"}!`);
                await fetchVehicles();  // Refresh the vehicle list
                resetForm();           // Reset form fields
            } else {
                toast.error("Failed to save vehicle model: " + (response.data.message || "Unknown error"));
            }
        } catch (error) {
            toast.error("An error occurred while saving the vehicle model.");
        } finally {
            setLoading(false);
        }
    };
    

    const resetForm = () => {
        setVehicleModel('');
        setVehicleCategory('');
        setVehicleMake('');
        setShowModal(false);
        setEditMode(false);
        setSelectedVehicle(null);
        setMakes([]);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastVehicle = currentPage * itemsPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    return (
        <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <div className="flex-grow ml-0 lg:ml-10 p-6">
                <h2 className="text-2xl font-bold mb-4">Vehicle Entry</h2>
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by vehicle model..."
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                    <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                        <FaSearch />
                    </button>
                </div>
                <button onClick={handleAddVehicle} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
                    <FaPlus className="mr-2" /> Add Vehicle
                </button>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">No.</th>
                                    <th className="py-3 px-6 text-left">Vehicle Model</th>
                                    <th className="py-3 px-6 text-left">Vehicle Category</th>
                                    <th className="py-3 px-6 text-left">Vehicle Make</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {currentVehicles.map((vehicle, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td className="py-3 px-6">{vehicle.model_name}</td>
                                        <td className="py-3 px-6">{vehicle.category_name}</td>
                                        <td className="py-3 px-6">{vehicle.make_name}</td>
                                        <td className="py-3 px-6">
                                            <button onClick={() => handleEditVehicle(vehicle)} className="text-blue-500 hover:text-blue-700 mr-3">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteVehicle(vehicle.vehicle_id)} className="text-red-500 hover:text-red-700">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded">Next</button>
                        </div>
                    </div>
                )}

                {/* Modal for adding/editing vehicles */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded p-6 w-96">
                            <h2 className="text-xl mb-4">{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Vehicle Category</label>
                                <select
                                    value={vehicleCategory}
                                    onChange={(e) => {
                                        setVehicleCategory(e.target.value);
                                        fetchMakesByCategory(e.target.value);
                                    }}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.vehicle_category_id} value={category.vehicle_category_id}>
                                            {category.vehicle_category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Vehicle Make</label>
                                <select
                                    value={vehicleMake}
                                    onChange={(e) => setVehicleMake(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                >
                                    <option value="">Select Make</option>
                                    {makes.map(make => (
                                        <option key={make.vehicle_make_id} value={make.vehicle_make_id}>
                                            {make.vehicle_make_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Vehicle Model</label>
                                <input
                                    type="text"
                                    value={vehicleModel}
                                    onChange={(e) => setVehicleModel(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">{editMode ? 'Update' : 'Save'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleEntry;
