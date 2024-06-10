import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Listing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    parking: false,
    offer: false,
    furnished: false,
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [download, setDownload] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setDownload(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setDownload(false);
        })
        .catch(() => {
          setImageUploadError('Image uplaod faild ( 2mb per image');
          setDownload(false);
        });
    } else {
      setImageUploadError('you can only upload 6 images per listing');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // update progress
          console.log(`Upload is ${progress}%`);
        },
        (err) => reject(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const deleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'rent' || e.target.id === 'sale') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };
  const submitListing = async (e) => {
    e.preventDefault();
    if (files.length < 1) return setErr('You must upload at least one image');
    if (parseInt(formData.regularPrice) < parseInt(formData.discountPrice))
      return setErr('Regular price must greater than discount price');
    try {
      setLoading(true);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = res.json();
      if (data.success === false) {
        setErr(data.message);
        setLoading(false);
      }
      setLoading(false);
      navigate('/');
    } catch (error) {
      setErr(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="font-bold text-3xl text-center my-4">
        Create new Listing
      </h1>
      <form onSubmit={submitListing} className="flex  gap-6">
        <div className="flex-1">
          <div className="flex flex-col gap-4  ">
            <input
              type="text"
              id="name"
              placeholder=" Name"
              className="rounded-lg border py-3 "
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              id="description"
              placeholder=" description"
              className="rounded-lg border py-3 "
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              id="address"
              placeholder=" Address"
              className="rounded-lg border py-3 "
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>
          <div className="mt-4 flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span className="font-semibold">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span className="font-semibold">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="font-semibold">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="font-semibold">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="font-semibold">Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap mt-6">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={500}
                className="p-3 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className="font-semibold">Baths</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={500}
                className="p-3 rounded-lg "
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="font-semibold">beds</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="regularPrice"
                className="p-3 rounded-lg "
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p className="font-semibold flex flex-col items-center">
                Regular price <span className="text-xs">( $ / Month )</span>
              </p>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2 ">
                <input
                  type="number"
                  id="discountPrice"
                  min={0}
                  max={100000}
                  className="p-3 rounded-lg "
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p className="font-semibold flex flex-col items-center">
                  Discount price <span className="text-xs">( $ / Month )</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-1 p-4 flex-col gap-6">
          <div className="flex gap-4">
            <p className="font-semibold">Image :</p>
            <span className="text-gray-500">
              The first image will be the cover (max 6)
            </span>
          </div>

          <div className="flex items-center ">
            <input
              type="file"
              name=""
              id=""
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="border border-green-700 rounded p-3 uppercase hover:shadow-lg disabled:opacity-80  "
            >
              {download ? 'downloading...' : 'Upload'}
            </button>
          </div>
          <span className="text-sm text-red-500">
            {imageUploadError && imageUploadError}
          </span>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div key={idx} className="flex justify-between items-center p-3">
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(idx)}
                  className="uppercase text-red-700 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || download}
            className="p-3 text-center uppercase bg-gray-800 text-white rounded-lg hover:opacity-55"
          >
            {loading ? 'Creating' : 'Create Listing'}
          </button>
          {err && <span className="text-sm text-red-500 ">{err}</span>}
        </div>
      </form>
    </main>
  );
};

export default Listing;
