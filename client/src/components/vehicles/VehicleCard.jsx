import { Link } from 'react-router-dom';
import { FiCalendar, FiSettings, FiDroplet } from 'react-icons/fi';
import { TbRoad } from 'react-icons/tb';
import { formatPrice, formatMileage, getPlaceholderImage } from '../../utils/helpers';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
    const {
        id,
        title,
        make,
        model,
        year,
        price,
        mileage,
        transmission,
        fuelType,
        images,
        status,
        featured
    } = vehicle;

    const imageUrl = images && images.length > 0
        ? images[0].url || images[0]
        : getPlaceholderImage();

    const statusLabels = {
        available: 'Available',
        reserved: 'Reserved',
        sold: 'Sold'
    };

    return (
        <Link to={`/vehicles/${id}`} className="vehicle-card">
            <div className="vehicle-card-image">
                <img src={imageUrl} alt={title || `${year} ${make} ${model}`} />

                {/* Status Badge */}
                <span className={`vehicle-status-badge ${status}`}>
                    {statusLabels[status]}
                </span>

                {/* Featured Badge */}
                {featured && (
                    <span className="vehicle-featured-badge">Featured</span>
                )}
            </div>

            <div className="vehicle-card-content">
                <h3 className="vehicle-title">{title || `${year} ${make} ${model}`}</h3>

                <div className="vehicle-specs">
                    <div className="vehicle-spec">
                        <FiCalendar />
                        <span>{year}</span>
                    </div>
                    <div className="vehicle-spec">
                        <TbRoad />
                        <span>{formatMileage(mileage)}</span>
                    </div>
                    <div className="vehicle-spec">
                        <FiSettings />
                        <span>{transmission}</span>
                    </div>
                    <div className="vehicle-spec">
                        <FiDroplet />
                        <span>{fuelType}</span>
                    </div>
                </div>

                <div className="vehicle-card-footer">
                    <span className="vehicle-price">{formatPrice(price)}</span>
                    <span className="vehicle-view-btn">View Details</span>
                </div>
            </div>
        </Link>
    );
};

export default VehicleCard;
