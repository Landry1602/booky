import { Link } from "react-router-dom"

function Navbar() {

    return (
        <>
        <Link to={`/reading-lists`}>Your Reading List</Link>
        <Link to={`/collections`}>Your Collections</Link>
        <Link to={`/favorites`}>Your Favorites</Link>
        <Link to={`/search`}>Search</Link>
        </>
    )
}

export default Navbar