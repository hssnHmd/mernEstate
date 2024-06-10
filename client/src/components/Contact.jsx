import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landrol, setLandrol] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandrol = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandrol(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandrol();
  }, [listing.userRef]);
  console.log(landrol);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landrol && (
        <div className="flex flex-col gap-3">
          <p>
            Contact{' '}
            <span className="text-xl font-bold">{landrol.username}</span> for{' '}
            <span className="font-semibold tex">
              {listing.name.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here ..."
            className="border rounded-lg w-full p-3"
          ></textarea>
          <Link
            to={`mailto:${landrol.email}?subject=Regarding${listing.name}&body=${message}`}
            className="bg-slate-500 text-center text-white p-2 uppercase rounded-lg"
          >
            send message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
