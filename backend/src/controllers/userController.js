const database = require("../../database/database");

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("SELECT id, username, email FROM user WHERE id = ?", [id])
        .then(([user]) => {
            if (user[0] != null) {
                res.json(user[0]);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

const postUser = (req, res) => {
    const { username, email, hashedPassword } = req.body;

    database
        .query(
            "INSERT INTO user (username, email, hashedPassword) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        )
        .then(([result]) => {
            res.status(201).send({ id: result.insertId });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, email, hashedPassword } = req.body;

    database
        .query(
            "UPDATE user SET username = ?, email = ?, hashedPassword = ? WHERE id = ?",
            [username, email, hashedPassword, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("DELETE FROM user WHERE id = ?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

module.exports = {
    getUserById,
    postUser,
    updateUser,
    deleteUser,
};
