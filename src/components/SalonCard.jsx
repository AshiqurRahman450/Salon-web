import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const SalonCard = ({ salon }) => {
  return (
    <Link to={`/app/salon/${salon._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-[180px] bg-[#eee] relative overflow-hidden">
          {salon.images && salon.images.length > 0 ? (
            <img src={`https://salon-backend-1-9dg3.onrender.com${salon.images[0]}`} alt={salon.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#aaa]">
              No Image
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{salon.name}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{salon.description || "Premium salon services."}</p>

          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>{salon.address?.city || "City"}, {salon.address?.state || "State"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SalonCard;
