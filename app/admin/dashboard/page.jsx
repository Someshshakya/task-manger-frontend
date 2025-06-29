'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../src/api/axiosInstance';

export default function AdminDashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalTasks, setTotalTasks] = useState(0);
    const [filterByUser, setFilterByUser] = useState('');
    const [uniqueUsers, setUniqueUsers] = useState([]);

    useEffect(() => {
        // Check if user is authenticated and is admin
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');

        if (!token) {
            router.push('/login');
            return;
        }

        if (role !== 'admin') {
            router.push('/user/dashboard');
            return;
        }

        setUserEmail(email);
        setUserRole(role);
        console.log('Admin dashboard mounted, fetching all tasks...');
        fetchAllTasks();
    }, [router]);

    const fetchAllTasks = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching all tasks...');
            const token = localStorage.getItem('token');
            console.log('Token available:', !!token);

            // Build query parameters
            const params = new URLSearchParams({
                skip: (currentPage * pageSize).toString(),
                limit: pageSize.toString()
            });

            // Add search parameter if search term exists
            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            // Same endpoint for both user and admin - backend handles role-based filtering
            const response = await axios.get(`/v1/api/tasks/all-tasks?${params.toString()}`);
            console.log('Full response:', response);
            console.log('Response data:', response.data);

            // Handle the correct response format: { data: [...], total: number }
            let tasksData = [];
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                tasksData = response.data.data;
                setTotalTasks(response.data.total || 0);
                console.log('Total tasks:', response.data.total);
            } else {
                console.error('Failed to fetch tasks. Please try again.');
                tasksData = [];
                setTotalTasks(0);
            }

            console.log('Processed tasks data:', tasksData);
            setTasks(tasksData);
            setFilteredTasks(tasksData);

            // Extract unique users for filtering
            const users = [...new Set(tasksData.map(task => task.createdBy).filter(Boolean))];
            setUniqueUsers(users);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            console.error('Error response:', error.response);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                router.push('/login');
            } else {
                console.error('Failed to fetch tasks. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        console.log('Refresh button clicked');
        fetchAllTasks();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        router.push('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/v1/api/tasks/${taskId}`);
                console.log('Task deleted successfully!');
                fetchAllTasks(); // Refresh the tasks list
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to delete task. Please try again.';
                console.error(errorMessage);
            }
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description || ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editFormData.title.trim()) {
            console.error('Task title is required');
            return;
        }

        try {
            await axios.put(`/v1/api/tasks/${editingTask._id}`, editFormData);
            console.log('Task updated successfully!');
            setEditingTask(null);
            setEditFormData({ title: '', description: '' });
            fetchAllTasks(); // Refresh the tasks list
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update task. Please try again.';
            console.error(errorMessage);
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditFormData({ title: '', description: '' });
    };

    // Filter tasks based on search term and user filter
    useEffect(() => {
        // Reset to first page when search term changes
        setCurrentPage(0);
        fetchAllTasks();
    }, [searchTerm]);

    // Fetch tasks when page changes
    useEffect(() => {
        fetchAllTasks();
    }, [currentPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalTasks / pageSize);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">Welcome, {userEmail} (Admin)</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters and Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">All Tasks Management</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Total: {tasks.length} tasks | Filtered: {filteredTasks.length} tasks
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                            <p className="text-gray-500">
                                {searchTerm || filterByUser ? 'Try adjusting your search or filter criteria.' : 'No tasks have been created by users yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                                    {editingTask && editingTask._id === task._id ? (
                                        // Edit Form
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <div>
                                                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Task Title *
                                                </label>
                                                <input
                                                    id="edit-title"
                                                    type="text"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Enter task title"
                                                    value={editFormData.title}
                                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    id="edit-description"
                                                    rows="3"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Enter task description (optional)"
                                                    value={editFormData.description}
                                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        // Normal Task Display
                                        <div className="space-y-4">
                                            {/* Title - Most Prominent */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                                    Title:
                                                </label>
                                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                                    {task.title}
                                                </h3>
                                            </div>

                                            {/* Description - Second Most Prominent */}
                                            {task.description && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                                        Description:
                                                    </label>
                                                    <p className="text-lg text-gray-700 leading-relaxed">
                                                        {task.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Task Details - Below Title and Description */}
                                            <div className="pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>Created: {formatDate(task.createdAt)}</span>
                                                        </div>
                                                        {task.createdBy && (
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                <span>By: {task.createdBy}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            Admin Managed
                                                        </span>
                                                        <button
                                                            onClick={() => handleEdit(task)}
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(task._id)}
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Next 10 Button */}
                {!isLoading && filteredTasks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalTasks)} of {totalTasks} tasks
                            </div>
                            <div className="flex items-center space-x-2">
                                {currentPage > 0 && (
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Previous 10
                                    </button>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                    >
                                        Next 10
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 