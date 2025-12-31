import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import { vehiclesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './AdminVehicleForm.css';

const AdminVehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '',
        color: '',
        bodyType: '',
        description: '',
        status: 'available',
        featured: false
    });
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        if (isEdit) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const response = await vehiclesAPI.getById(id);
            const vehicle = response.data.data;
            setFormData({
                title: vehicle.title || '',
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: vehicle.year || new Date().getFullYear(),
                price: vehicle.price || '',
                mileage: vehicle.mileage || '',
                transmission: vehicle.transmission || 'Automatic',
                fuelType: vehicle.fuelType || 'Petrol',
                engineSize: vehicle.engineSize || '',
                color: vehicle.color || '',
                bodyType: vehicle.bodyType || '',
                description: vehicle.description || '',
                status: vehicle.status || 'available',
                featured: vehicle.featured || false
            });
            setImages(vehicle.images || []);
        } catch (error) {
            toast.error('Failed to fetch vehicle');
            navigate('/admin/vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setNewImages(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (index) => {
        const image = images[index];
        if (image.publicId) {
            try {
                await vehiclesAPI.deleteImage(id, image.publicId.split('/').pop());
                setImages(prev => prev.filter((_, i) => i !== index));
                toast.success('Image removed');
            } catch (error) {
                toast.error('Failed to remove image');
            }
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let vehicleId = id;

            // Generate title if not provided
            const dataToSend = {
                ...formData,
                title: formData.title || `${formData.year} ${formData.make} ${formData.model}`
            };

            if (isEdit) {
                await vehiclesAPI.update(id, dataToSend);
                toast.success('Vehicle updated successfully');
            } else {
                const response = await vehiclesAPI.create(dataToSend);
                vehicleId = response.data.data.id;
                toast.success('Vehicle created successfully');
            }

            // Upload new images
            if (newImages.length > 0) {
                setUploading(true);
                const formDataImages = new FormData();
                newImages.forEach(img => {
                    formDataImages.append('images', img.file);
                });
                await vehiclesAPI.uploadImages(vehicleId, formDataImages);
                setUploading(false);
            }

            navigate('/admin/vehicles');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save vehicle');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const makes = [
        'Toyota', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Honda', 'Nissan',
        'Mazda', 'Subaru', 'Land Rover', 'Range Rover', 'Mitsubishi', 'Hyundai',
        'Kia', 'Ford', 'Chevrolet', 'Jeep', 'Porsche', 'Lexus', 'Other'
    ];

    const bodyTypes = [
        'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon', 'Pickup', 'Van', 'Convertible'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    if (loading) {
        return (
            <div className="form-loading">
                <div className="loading-spinner"></div>
                <p>Loading vehicle...</p>
            </div>
        );
    }

    return (
        <div className="admin-vehicle-form">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate('/admin/vehicles')}>
                    <FiArrowLeft /> Back to Vehicles
                </button>
                <h1>{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Basic Info */}
                    <div className="form-section">
                        <h3>Basic Information</h3>

                        <div className="form-group">
                            <label className="form-label">Title (optional)</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="Auto-generated if empty"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Make *</label>
                                <select
                                    name="make"
                                    className="form-select"
                                    value={formData.make}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Make</option>
                                    {makes.map(make => (
                                        <option key={make} value={make}>{make}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Model *</label>
                                <input
                                    type="text"
                                    name="model"
                                    className="form-input"
                                    placeholder="e.g. Camry, X5"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Year *</label>
                                <select
                                    name="year"
                                    className="form-select"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price (KES) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-input"
                                    placeholder="e.g. 3500000"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="form-section">
                        <h3>Specifications</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Mileage (km)</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    className="form-input"
                                    placeholder="e.g. 50000"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Engine Size</label>
                                <input
                                    type="text"
                                    name="engineSize"
                                    className="form-input"
                                    placeholder="e.g. 2.5L"
                                    value={formData.engineSize}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Transmission</label>
                                <select
                                    name="transmission"
                                    className="form-select"
                                    value={formData.transmission}
                                    onChange={handleChange}
                                >
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fuel Type</label>
                                <select
                                    name="fuelType"
                                    className="form-select"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                >
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    className="form-input"
                                    placeholder="e.g. Pearl White"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Body Type</label>
                                <select
                                    name="bodyType"
                                    className="form-select"
                                    value={formData.bodyType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Body Type</option>
                                    {bodyTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-section full-width">
                        <h3>Description</h3>
                        <div className="form-group">
                            <textarea
                                name="description"
                                className="form-textarea"
                                rows="5"
                                placeholder="Describe the vehicle features, condition, and any special notes..."
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Status & Featured */}
                    <div className="form-section">
                        <h3>Status</h3>

                        <div className="form-group">
                            <label className="form-label">Availability Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span>Feature this vehicle on homepage</span>
                            </label>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="form-section">
                        <h3>Images</h3>

                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="file-input"
                            />
                            <label htmlFor="images" className="upload-label">
                                <FiUpload />
                                <span>Click to upload images</span>
                                <small>JPEG, PNG, WebP up to 5MB each</small>
                            </label>
                        </div>

                        {/* Existing Images */}
                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img.url || img} alt={`Vehicle ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Images */}
                        {newImages.length > 0 && (
                            <div className="image-preview-grid">
                                {newImages.map((img, index) => (
                                    <div key={index} className="image-preview new">
                                        <img src={img.preview} alt={`New ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => removeNewImage(index)}
                                        >
                                            <FiX />
                                        </button>
                                        <span className="new-badge">New</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => navigate('/admin/vehicles')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving || uploading}
                    >
                        <FiSave />
                        {saving || uploading ? 'Saving...' : (isEdit ? 'Update Vehicle' : 'Add Vehicle')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminVehicleForm;
