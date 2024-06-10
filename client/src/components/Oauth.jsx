import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { signingSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Oauth() {
  const dsipatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dsipatch(signingSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Google Auth failed', error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-700 rounded-lg p-3 uppercase "
    >
      Continue with Google
    </button>
  );
}
