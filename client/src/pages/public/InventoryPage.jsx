import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import VehicleCard from '../../components/vehicles/VehicleCard';
import { vehiclesAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import './InventoryPage.css';

const InventoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [makes, setMakes] = useState([]);

    // Filter state
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        make: searchParams.get('make') || '',
        transmission: searchParams.get('transmission') || '',
        fuelType: searchParams.get('fuelType') || '',
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
        yearMin: searchParams.get('yearMin') || '',
        yearMax: searchParams.get('yearMax') || '',
        status: 'available',
        sort: searchParams.get('sort') || 'createdAt',
        order: searchParams.get('order') || 'DESC'
    });

    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        fetchVehicles();
        fetchMakes();
    }, [searchParams]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 12,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== '')
                )
            };
            const response = await vehiclesAPI.getAll(params);
            setVehicles(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMakes = async () => {
        try {
            const response = await vehiclesAPI.getStats();
            setMakes(response.data.data.makes || []);
        } catch (error) {
            console.error('Error fetching makes:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        params.set('page', '1');
        setSearchParams(params);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            make: '',
            transmission: '',
            fuelType: '',
            priceMin: '',
            priceMax: '',
            yearMin: '',
            yearMax: '',
            status: 'available',
            sort: 'createdAt',
            order: 'DESC'
        });
        setSearchParams({});
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortOptions = [
        { value: 'createdAt-DESC', label: 'Newest First' },
        { value: 'createdAt-ASC', label: 'Oldest First' },
        { value: 'price-ASC', label: 'Price: Low to High' },
        { value: 'price-DESC', label: 'Price: High to Low' },
        { value: 'year-DESC', label: 'Year: Newest' },
        { value: 'year-ASC', label: 'Year: Oldest' },
        { value: 'mileage-ASC', label: 'Mileage: Low to High' }
    ];

    const handleSortChange = (value) => {
        const [sort, order] = value.split('-');
        setFilters(prev => ({ ...prev, sort, order }));
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        params.set('order', order);
        params.set('page', '1');
        setSearchParams(params);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <div className="inventory-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Our Vehicle Inventory</h1>
                    <p>Browse our collection of quality imported and local vehicles</p>
                </div>
            </div>

            <div className="container">
                <div className="inventory-layout">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button className="close-filters" onClick={() => setShowFilters(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="filter-group">
                            <label>Search</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search vehicles..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Make</label>
                            <select
                                className="form-select"
                                value={filters.make}
                                onChange={(e) => handleFilterChange('make', e.target.value)}
                            >
                                <option value="">All Makes</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Transmission</label>
                            <select
                                className="form-select"
                                value={filters.transmission}
                                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Fuel Type</label>
                            <select
                                className="form-select"
                                value={filters.fuelType}
                                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range (KES)</label>
                            <div className="filter-row">
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Min"
                                    value={filters.priceMin}
                                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Max"
                                    value={filters.priceMax}
                                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Year</label>
                            <div className="filter-row">
                                <select
                                    className="form-select"
                                    value={filters.yearMin}
                                    onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                                >
                                    <option value="">From</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <span>to</span>
                                <select
                                    className="form-select"
                                    value={filters.yearMax}
                                    onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                                >
                                    <option value="">To</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="btn btn-primary" onClick={applyFilters}>
                                Apply Filters
                            </button>
                            <button className="btn btn-outline" onClick={clearFilters}>
                                Clear All
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="inventory-main">
                        {/* Toolbar */}
                        <div className="inventory-toolbar">
                            <div className="toolbar-left">
                                <button
                                    className="btn btn-outline filter-toggle"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <FiFilter /> Filters
                                </button>
                                <span className="results-count">
                                    {pagination.total || 0} vehicles found
                                </span>
                            </div>
                            <div className="toolbar-right">
                                <div className="sort-select">
                                    <select
                                        value={`${filters.sort}-${filters.order}`}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="select-icon" />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Grid */}
                        {loading ? (
                            <div className="loading-grid">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="loading-card animate-pulse"></div>
                                ))}
                            </div>
                        ) : vehicles.length > 0 ? (
                            <>
                                <div className="vehicles-grid">
                                    {vehicles.map((vehicle) => (
                                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="pagination-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            className="pagination-btn"
                                            disabled={currentPage === pagination.pages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-results">
                                <h3>No vehicles found</h3>
                                <p>Try adjusting your filters or search criteria</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
