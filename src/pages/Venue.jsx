import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import '../vehicle.css';

const VenueEntry = () => {
    const adminId = localStorage.getItem('adminId') || '';
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [venueName, setVenueName] = useState('');
    const [maxOccupancy, setMaxOccupancy] = useState('');
    const [venueExists, setVenueExists] = useState(false);
    const navigate = useNavigate();
    const adminLevel = localStorage.getItem('adminLevel');

    useEffect(() => {
        if (adminLevel !== '1') {
            localStorage.clear();
            navigate('/');
        }
    }, [adminLevel, navigate]);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        setLoading(true);
        const url = "http://localhost/coc/gsd/user.php";
        const jsonData = { operation: "fetchVenues" };

        try {
            const response = await axios.post(url, new URLSearchParams(jsonData));
            if (response.data.status === 'success') {
                setVenues(response.data.data);
            } else {
                toast.error("Error fetching venues: " + response.data.message);
            }
        } catch (error) {
            console.error("Error fetching venues:", error);
            toast.error("An error occurred while fetching venues.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddVenue = () => {
        setVenueName('');
        setMaxOccupancy('');
        setShowModal(true);
        setVenueExists(false);
    };

    const checkVenueExists = async () => {
        const response = await axios.post("http://localhost/coc/gsd/user.php", new URLSearchParams({
            operation: "venueExists",
            json: JSON.stringify({ venue_name: venueName })
        }));

        if (response.data.status === 'success' && response.data.exists) {
            setVenueExists(true);
        } else {
            setVenueExists(false);
        }
    };

    const handleSubmit = async () => {
        if (!venueName || !maxOccupancy) {
            toast.error("All fields are required!");
            return;
        }

        const venueData = {
            venue_name: venueName,
            max_occupancy: maxOccupancy,
            adminId: adminId,
        };

        const formData = new FormData();
        formData.append("operation", "saveVenueData");
        formData.append("json", JSON.stringify(venueData));

        setLoading(true);
        try {
            const url = "http://localhost/coc/gsd/insert_master.php";
            const response = await axios.post(url, formData);
            if (response.data.status === 'success') {
                toast.success("Venue successfully added!");
                fetchVenues();
                setShowModal(false);
            } else {
                toast.warning("Failed to save venue: " + (response.data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error saving venue:", error);
            toast.error("An error occurred while saving the venue.");
        } finally {
            setLoading(false);
        }
    };

    const handleVenueNameChange = (e) => {
        setVenueName(e.target.value);
        checkVenueExists();
    };

    const filteredVenues = venues.filter(venue =>
        venue.ven_name && venue.ven_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastVenue = currentPage * entriesPerPage;
    const indexOfFirstVenue = indexOfLastVenue - entriesPerPage;
    const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
    const totalPages = Math.ceil(filteredVenues.length / entriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <div className="flex-grow ml-0 lg:ml-10 p-6">
                <h2 className="text-2xl font-bold">Venue Entry</h2>
                <div className="flex flex-col lg:flex-row items-center mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="border border-gray-300 p-2 rounded w-full max-w-xs"
                    />
                    <button onClick={handleAddVenue} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
                        Add Venue
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
                                <th className="py-3 px-6 text-left">Venue Name</th>
                                <th className="py-3 px-6 text-left">Occupancy</th>
                                <th className="py-3 px-6 text-left">Created At</th>
                                <th className="py-3 px-6 text-left">Updated At</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {currentVenues.length > 0 ? (
                                currentVenues.map((venue, index) => (
                                    <tr key={venue.ven_id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6">{indexOfFirstVenue + index + 1}</td>
                                        <td className="py-3 px-6">{venue.ven_name}</td>
                                        <td className="py-3 px-6">{venue.ven_occupancy}</td>
                                        <td className="py-3 px-6">{venue.ven_created_at}</td>
                                        <td className="py-3 px-6">{venue.ven_updated_at}</td>
                                        <td className="py-3 px-6">
                                            {/* Implement edit and delete actions here */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-3">NO VENUES FOUND</td>
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
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h3 className="text-lg font-bold mb-4">Add Venue</h3>
                            <input
                                type="text"
                                placeholder="Venue Name"
                                value={venueName}
                                onChange={handleVenueNameChange}
                                className={`border p-2 rounded w-full mb-4 ${venueExists ? 'border-orange-500' : 'border-gray-300'}`}
                            />
                            {venueExists && (
                                <div className="text-orange-500 mb-2">This venue already exists.</div>
                            )}
                            <input
                                type="number"
                                placeholder="Max Occupancy"
                                value={maxOccupancy}
                                onChange={(e) => setMaxOccupancy(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full mb-4"
                            />
                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Cancel</button>
                                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VenueEntry;
