import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  deleteFailue,
  deleteStart,
  deleteSuccess,
  signOutFailue,
  signOutStart,
  signOutSuccess,
  updateFailue,
  updateStart,
  updateSuccess,
} from '../redux/user/userSlice';

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [percent, setPercent] = useState(0);
  const [formaData, setFormaData] = useState({});
  const [errFileUpload, setErrFileUpload] = useState(false);
  const [updated, SetUpdateSuccess] = useState(false);
  const [err, setErr] = useState('');
  const [listings, setListings] = useState({});

  // progress

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormaData({
      ...formaData,
      [e.target.id]: e.target.value,
    });
  };
  const handleFileUpload = (file) => {
    if (!file) {
      alert('Please upload an image first!');
    }
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        setPercent(percent);
      },
      () => setErrFileUpload(true),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormaData({
            ...formaData,
            avatar: downloadUrl,
          });
        });
      }
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formaData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateFailue(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      SetUpdateSuccess(true);
    } catch (error) {
      dispatch(updateFailue(error.message));
    }
  };

  const deleteProfile = async () => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteFailue(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailue(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/logout');
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutFailue(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailue(error.message));
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setErr(data.message);
        return;
      }
      setListings(data);
    } catch (error) {
      setErr(error.message);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (error) {
      setErr(error);
    }
  };
  return (
    <div className="p-4 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center py-4">Profile</h1>
      {/* {error && <span className="py-3 text-red-300">{error}</span>} */}
      <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formaData.avatar || currentUser.avatar}
          alt=""
          className="w-24 h-24 rounded-full self-center cursor-pointer object-cover"
          onClick={() => fileRef.current.click()}
        />
        {errFileUpload && (
          <span className="text-red-500 text-sm py-5 text-center">
            {errFileUpload}
          </span>
        )}
        {percent > 0 && percent < 100 ? (
          <span className="text-slate-500 text-sm py-5 text-center">{`file upladed ${percent}%`}</span>
        ) : percent === 100 ? (
          <span className="text-green-500 text-sm">
            file uplaoded successfully
          </span>
        ) : (
          ''
        )}
        <input
          type="text"
          defaultValue={currentUser.username}
          id="username"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
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
          Update
        </button>
        <Link
          to="/create-listing"
          className="text-white text-center bg-green-900 p-2 rounded-lg hover:opacity-90 uppercase disabled:opacity-70"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-2 ">
        <button
          onClick={deleteProfile}
          type="button"
          className="text-red-700 text-sm"
        >
          Delete acount
        </button>
        <button className="text-red-700 text-sm" onClick={handleLogout}>
          SignOut
        </button>
      </div>
      {updated ? (
        <span className="text-sm text-green-500 ">
          Profile has been updated successfully
        </span>
      ) : (
        ''
      )}
      <div className="mt-4">
        <button
          onClick={fetchListings}
          className="outline-none text-green-400 w-full "
        >
          Show Listings
        </button>
        {listings.length > 0
          ? listings.map((list) => (
              <div
                className="flex items-center justify-between gap-2 my-1"
                key={list._id}
              >
                <img
                  src={list.imageUrls[0]}
                  className="w-24 h-24 object-cover rounded-full"
                  alt={list.name}
                />
                <Link to={`/listing/${list._id}`}>
                  <span className="font-semibold text-sm truncate hover:underline">
                    {list.name}
                  </span>
                </Link>
                <div className="flex flex-col">
                  <button
                    onClick={() => deleteListing(list._id)}
                    className="text-red-700"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${list._id}`}>
                    <button className="text-green-700">Edit</button>
                  </Link>
                </div>
              </div>
            ))
          : 'No Items in this Listing'}
      </div>
    </div>
  );
}

export default Profile;
