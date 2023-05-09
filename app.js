require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const database = require("./database");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", (req, res) => {
  database
    .query("SELECT * from users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data from database");
    });
});
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("SELECT * from users WHERE id= ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data from database");
    });
});

app.post(`/api/movies`, movieHandlers.postMovie);

app.post(`/api/users`, movieHandlers.postUser);

app.put(`/api/movies/:id`, movieHandlers.updateMovie);

app.put(`/api/users/:id`, movieHandlers.updateUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
