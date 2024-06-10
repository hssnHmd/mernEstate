import { useState } from 'react';
import { Link } from 'react-router-dom';
import Oauth from '../components/Oauth';

function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <div className="p-4 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center py-7">Signup</h1>
      {error && <span className="py-3 text-red-300">{error}</span>}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />
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
        <button
          className="text-white bg-slate-700 p-2 rounded-lg hover:opacity-90 uppercase disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'signup'}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-2 ">
        <p>Have you an account ?</p>
        <Link to="/signin" className="underline text-blue-400">
          sign in
        </Link>
      </div>
    </div>
  );
}

export default Signup;
