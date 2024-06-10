import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlsParams = new URLSearchParams(location.search);
    const searctTermFromUrl = urlsParams.get('searchTerm');
    if (searctTermFromUrl) {
      setSearchTerm(searctTermFromUrl);
    }
  }, []);

  return (
    <nav className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center p-3 max-w-6xl mx-auto ">
        <Link to="/">
          <div className="font-semibold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">HSs</span>
            <span className="text-slate-700">Estate</span>
          </div>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg flex items-center p-3 bg-slate-100"
        >
          <input
            type="text"
            placeholder="Serach..."
            className="bg-transparent focus:outline-none sm:w-64 w-24 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex justify-between gap-4">
          <Link to="/">
            <li className=" text-slate-700 hidden sm:inline hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className=" text-slate-700 hidden sm:inline hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            <li className=" text-slate-700 hidden sm:inline hover:underline">
              Profile
            </li>
          </Link>
          {currentUser?.avatar ? (
            <Link to="/profile">
              <li className=" text-slate-700  sm:inline ">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.username}
                  className="w-8 h-8 rounded-full"
                />
              </li>
            </Link>
          ) : (
            <Link to="/signin">
              <li className=" text-slate-700  sm:inline hover:underline">
                Signin
              </li>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
