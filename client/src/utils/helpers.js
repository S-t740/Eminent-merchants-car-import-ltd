// Format price in Kenyan Shillings
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Format number with commas
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-KE').format(num);
};

// Format mileage
export const formatMileage = (mileage) => {
    if (!mileage) return 'N/A';
    return `${formatNumber(mileage)} km`;
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format relative time
export const formatRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

// Get status badge color
export const getStatusColor = (status) => {
    switch (status) {
        case 'available':
            return 'success';
        case 'reserved':
            return 'warning';
        case 'sold':
            return 'error';
        default:
            return 'info';
    }
};

// Generate WhatsApp link
export const getWhatsAppLink = (phone, message = '') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Generate vehicle title
export const generateVehicleTitle = (vehicle) => {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
};

// Get placeholder image
export const getPlaceholderImage = (index = 0) => {
    const colors = ['3B82F6', 'EF4444', '10B981', 'F59E0B', '8B5CF6'];
    const color = colors[index % colors.length];
    return `https://placehold.co/800x600/${color}/FFFFFF?text=No+Image`;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
