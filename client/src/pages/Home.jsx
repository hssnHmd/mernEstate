import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import CartListing from '../components/CartListing';

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListins();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListins = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      const res = await fetch('/api/listing/get?type=sale&limit=4');
      const data = await res.json();
      setSaleListings(data);
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-3xl mx-auto">
        <h1 className="font-bold text-slate-700 text-3xl lg:text-6xl ">
          Find your next <span className="text-slate-500">perfect</span> <br />
          place with ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          HssEstate will help you to find your future home easer,comfortable
          <br />
          our expertsupport are always available
        </p>
        <Link
          className="text-blue-700 font-bold  hover:underline"
          to={'/search'}
        >
          Let&apos;s start now ...
        </Link>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto py-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <h2 className="font-semibold text-2xl text-gray-700">
              Recent Offers
            </h2>
            <Link className="text-blue-800" to="/search?offer=true">
              show more offers
            </Link>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((offer) => (
                <CartListing key={offer._id} listing={offer} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <h2 className="font-semibold text-2xl text-gray-700">
              Recent Rent
            </h2>
            <Link className="text-blue-800" to="/search?type=rent">
              show more places fro rent
            </Link>
            <div className="flex flex-wrap gap-2">
              {rentListings.map((rent) => (
                <CartListing key={rent._id} listing={rent} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <h2 className="font-semibold text-2xl text-gray-700">
              Recent Sale
            </h2>
            <Link className="text-blue-800" to="/search?type=sale">
              show more places for sale
            </Link>
            <div className="flex flex-wrap gap-2">
              {saleListings.map((sale) => (
                <CartListing key={sale._id} listing={sale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
