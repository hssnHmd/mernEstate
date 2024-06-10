import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  signingFailue,
  signingStart,
  signingSuccess,
} from '../redux/user/userSlice';
import Oauth from '../components/Oauth';

function Signin() {
  const [credentiel, setCredentiel] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setCredentiel({
      ...credentiel,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signingStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentiel),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signingFailue(data.message));
        return;
      }
      dispatch(signingSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signingFailue(err.message));
    }
  };
  return (
    <div className="p-4 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center py-7">Sign In</h1>
      {error && <span className="py-3 text-red-300">{error}</span>}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="text-white bg-slate-700 p-2 rounded-lg hover:opacity-90 uppercase disabled:opacity-70">
          {loading ? 'Loading...' : 'signin'}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-2 ">
        <p>Dont have an account ?</p>
        <Link to="/signup" className="underline text-blue-400">
          sign in
        </Link>
      </div>
    </div>
  );
}

export default Signin;
