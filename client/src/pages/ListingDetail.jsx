import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

const ListingDetail = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listingDetail, setListingDetail] = useState(null);
  const { listingId } = useParams();
  const [err, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setListingDetail(data);
      setLoading(false);
    };
    fetchListing();
  }, [listingId]);

  return (
    <main>
      {loading && (
        <span className="text-3xl font-bold text-center">Loading ...</span>
      )}
      {listingDetail && !loading && !err && (
        <>
          <Swiper navigation>
            {listingDetail.imageUrls.map((url, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listingDetail.name} - ${' '}
              {listingDetail.offer
                ? listingDetail.discountPrice.toLocaleString('en-US')
                : listingDetail.regularPrice.toLocaleString('en-US')}
              {listingDetail.type === 'rent' && ' / month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listingDetail.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listingDetail.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listingDetail.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listingDetail.regularPrice - +listingDetail.discountPrice}{' '}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listingDetail.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listingDetail.bedrooms > 1
                  ? `${listingDetail.bedrooms} beds `
                  : `${listingDetail.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listingDetail.bathrooms > 1
                  ? `${listingDetail.bathrooms} baths `
                  : `${listingDetail.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listingDetail.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listingDetail.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser &&
              listingDetail.userRef !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listingDetail} />}
          </div>
        </>
      )}
    </main>
  );
};

export default ListingDetail;
