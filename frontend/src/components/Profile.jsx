import { useUser } from '../contexts/UserContext'; // Import the custom hook
import { Link } from 'react-router-dom';

const Profile = () => {
    const { username } = useUser(); // Access the username from the context

    return (
        <div>
            <h1>{username ? `${username}'s Profile` : 'Profile'}</h1>
            <div>
                <ul>
                    <li><Link to={`/reading-lists`}>Your Reading List</Link></li>
                    <li><Link to={`/collections`}>Your Collections</Link></li>
                    <li><Link to={`/favorites`}>Your Favorites</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;