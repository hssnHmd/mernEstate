import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
// eslint-disable-next-line react/prop-types
const CartListing = ({ listing }) => {
  return (
    <div className="sm:w-[330px] w-full xs:h-[550px] shadow-md hover:shadow-lg overflow-hidden bg-white  rounded-lg">
      <Link
        to={`/listing/${listing._id}`}
        className="inline-block w-full h-full"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className=" h-[320px] sm:h-[220px] w-full object-cover rounded-lg hover:scale-105 transition-scale"
        />
        <div className="flex flex-col gap-4 p-4">
          <p className="text-2xl truncate text-gray-600 capitalize ">
            {listing.name}
          </p>
          <div className="flex items-center gap-3">
            <MdLocationOn className="w-4 h-4 text-green-700" />
            <span className="text-sm text-gray-600 font-semibold">
              {listing.address}
            </span>
          </div>
          <p className="text-sm line-clamp-1">{listing.description}</p>
          <span className="text-xl font-bold text-gray-500">
            $ {listing.regularPrice.toLocaleString('en-US')} / Month
          </span>
          <div className="flex items-center gap-8">
            <span className="text-sm font-semibold ">
              {listing.bathrooms} Baths
            </span>
            <span className="text-sm font-semibold ">
              {listing.bedrooms} beds
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CartListing;
