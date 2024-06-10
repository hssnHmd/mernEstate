import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartListing from '../components/CartListing';

const Search = () => {
  const navigate = useNavigate();
  const [searchItems, setSearchItems] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    parking: false,
    furnished: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [filtredListings, setFiltredListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTermUrl = searchParams.get('searchTerm');
    const typesearchUrl = searchParams.get('type');
    const offersearchUrl = searchParams.get('offer');
    const parkingSearchUrl = searchParams.get('parking');
    const furnishedSearchUrl = searchParams.get('furnished');
    const sortSearchUrl = searchParams.get('sort');
    const orderSearchUrl = searchParams.get('order');
    if (
      searchTermUrl ||
      sortSearchUrl ||
      orderSearchUrl ||
      typesearchUrl ||
      offersearchUrl ||
      parkingSearchUrl ||
      furnishedSearchUrl
    ) {
      setSearchItems({
        ...searchItems,
        searchTerm: searchTermUrl || '',
        type: typesearchUrl || 'all',
        offer: offersearchUrl === true ? true : false,
        parking: parkingSearchUrl === true ? true : false,
        sort: sortSearchUrl || 'created_at',
        order: orderSearchUrl || 'desc',
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchquery = searchParams.toString();
      const res = await fetch(`/api/listing/get?${searchquery}`);
      const data = await res.json();
      if (data.length > 4) {
        setShowMore(true);
      }
      setFiltredListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'sale' ||
      e.target.id === 'rent'
    ) {
      setSearchItems({
        ...searchItems,
        type: e.target.id,
      });
    }
    if (e.target.id === 'searchTerm') {
      setSearchItems({ ...searchItems, searchTerm: e.target.value });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSearchItems({
        ...searchItems,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSearchItems({ ...searchItems, sort, order });
    }
  };

  const handleSubmite = (e) => {
    e.preventDefault();

    const searchUrl = new URLSearchParams();
    searchUrl.set('searchTerm', searchItems.searchTerm);
    searchUrl.set('type', searchItems.type);
    searchUrl.set('offer', searchItems.offer);
    searchUrl.set('parking', searchItems.parking);
    searchUrl.set('furnished', searchItems.furnished);
    searchUrl.set('sort', searchItems.sort);
    searchUrl.set('order', searchItems.order);
    const searchQuery = searchUrl.toString();
    navigate(`/search?${searchQuery}`);
  };

  const showMoreListing = async () => {
    const totalListing = filtredListings.length;
    const startIndex = totalListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 5) {
      setShowMore(false);
    }
    setFiltredListings([...filtredListings, ...data]);
  };
  return (
    <div className="flex gap-8 p-7">
      <div className="flex flex-1">
        <form className="flex flex-col gap-10" onSubmit={handleSubmite}>
          <div className="flex gap-2 items-center ">
            <span className="font-semibold whitespace-nowrap  text-lg">
              Search term :
            </span>
            <input
              className="border w-full  p-2 outline rounded-lg"
              type="text"
              id="searchTerm"
              value={searchItems.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-lg"> Type : </span>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                onChange={handleChange}
                checked={searchItems.type === 'all'}
                id="all"
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="all"
              >
                Sale & Rent
              </label>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={searchItems.type === 'sale'}
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="sale"
              >
                Sale
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={searchItems.type === 'rent'}
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="rent"
              >
                Rent
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={searchItems.offer}
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="offer"
              >
                Offer
              </label>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-semibold  text-lg">Ameneties :</span>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={searchItems.parking}
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="parking"
              >
                Parking
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={searchItems.furnished}
              />
              <label
                className="font-medium text-gray-500 cursor-pointer"
                htmlFor="furnished"
              >
                Furnished
              </label>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-semibold  text-lg" htmlFor="sort_order">
              Sort:
            </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              defaultValue="created_at_desc"
              onChange={handleChange}
            >
              <option
                value="regularPrice_desc"
                className="cursor-pointer text-gray-500"
              >
                Price hight to low
              </option>
              <option
                value="regularPrice_asc"
                className="cursor-pointer text-gray-500"
              >
                Price low to hight
              </option>
              <option
                value="createdAt_desc"
                className="cursor-pointer text-gray-500"
              >
                Latest
              </option>
              <option
                value="createdAt_asc"
                className="cursor-pointer text-gray-500"
              >
                Oldest
              </option>
            </select>
          </div>

          <button className="border bg-slate-700 rounded-lg p-3 text-white uppercase hover:shadow-lg disabled:opacity-80  ">
            Search
          </button>
        </form>
      </div>
      <div className="flex-grow">
        <h1 className="text-3xl font-semibold text-start">Listing Result</h1>
        {loading && filtredListings.length === 0 && (
          <h3 className="text-2xl font-semibold">No Listing Founded</h3>
        )}
        <div className="flex gap-4 flex-wrap mt-5">
          {!loading &&
            filtredListings.length > 0 &&
            filtredListings.map((listing) => (
              <CartListing key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && (
          <button
            className="text-green-700 w-full text-center"
            onClick={showMoreListing}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
