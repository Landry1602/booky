import { useParams } from 'react-router-dom';
import BookCard from './BookCard';

const BookCardWrapper = () => {
    const { isbn } = useParams();
    return <BookCard isbn={isbn} />;
};

export default BookCardWrapper;