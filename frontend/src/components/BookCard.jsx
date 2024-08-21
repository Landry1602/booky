import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const BookCard = ({ isbn }) => {
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
            setBook(response.data[`ISBN:${isbn}`]);
        };

        fetchBookDetails();
    }, [isbn]);

    if (!book) return <div>Loading...</div>;

    return (
        <div className="book-card">
            <img src={book.cover?.large || `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`} alt={`${book.title} cover`} />
            <h2>{book.title}</h2>
            <p>Author: {book.authors?.[0]?.name}</p>
            <p>Published: {book.publish_date}</p>
           {book.number_of_pages ? <p>Pages: {book.number_of_pages}</p> : ''}
            <p>ISBN: {isbn}</p>
        </div>
    );
};

BookCard.propTypes = {
    isbn: PropTypes.string.isRequired,
};

export default BookCard;
