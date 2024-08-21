import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  '../styles/Search.css'

const SearchBooks = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;

        setIsLoading(true);
        try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&lang=fre`);
        setResults(response.data.docs);

    } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || err.message);
    } finally {
        setIsLoading(false);
    }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClick = (isbn) => {
        navigate(`/book/${isbn}`);
    };

    return (
        <div>
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="Search for books..." 
            />
            <button onClick={handleSearch} disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'}</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="results-flex">
                {results.map((book) => (
                    <div key={book.key} className="book-item" onClick={() => handleClick(book.isbn?.[0])}>
                       
                        <h3>{book.title}</h3>
                        <p>by {book.author_name?.join(', ')}</p>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default SearchBooks;
