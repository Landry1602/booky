const database = require('../../database/database');

const addCollection = async (req, res) => {
    const { isbn } = req.body;
    const userId = req.user.id;

    try {
        await database.query(
            "INSERT INTO collection (user_id, isbn) VALUES (?, ?)",
            [userId, isbn]
        );
        res.status(201).send({ message: 'Book added to favorites' });
    } catch (error) {
        console.error('Error adding collection:', error);
        res.sendStatus(500);
    }
};

const getCollection = async (req, res) => {
    const userId = req.user.id;

    try {
        const [collection] = await database.query(
            "SELECT isbn FROM collection WHERE user_id = ?",
            [userId]
        );

        const bookDetailsPromises = favorites.map(favorite => {
            const isbn = favorite.isbn;
            return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
                .then(response => response.json())
                .then(data => data.items ? data.items[0] : null); // Adjust based on API response
        });

        const books = await Promise.all(bookDetailsPromises);

        res.json(books.filter(book => book !== null)); // Filter out any null results
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.sendStatus(500);
    }
};

module.exports = {
    addCollection,
    getCollection,
};
