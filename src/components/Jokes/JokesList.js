import React, { useEffect, useState, useCallback } from "react";
import { makeStyles, Box, Typography } from "@material-ui/core";
import Joke from "./Joke";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  jokesList: {
    display: "flex",
    width: "80%",
    height: "80%",
  },
  jokesListSidebar: {
    backgroundColor: "#9575cd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.1)",
    zIndex: 2,
    borderRadius: 7,
  },
  jokeListTitle: {
    fontSize: "3rem",
    color: "white",
    fontWeight: 700,
    margin: 60,
    letterSpacing: 0,
  },
  sidebarImage: {
    width: "50%",
    boxShadow: "0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "40%",
  },
  jokesListJokes: {
    height: "90%",
    width: "70%",
    backgroundColor: "white",
    alignSelf: "center",
    boxShadow: "0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.1)",
    overflow: "scroll",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
}));

export default function JokesList() {
  const classes = useStyles();
  const [jokes, setJokes] = useState(null);

  async function getJokes() {
    let newJokes = [];
    for (var i = 1; i < 7; i++) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      newJokes.push({ id: i, text: res.data.joke, votes: 0 });
    }
    setJokes(newJokes);
  }

  useEffect(() => {
    getJokes();
  }, []);

  const handleVote = useCallback((id, offset) => {
    let filteredJokes = jokes.filter((joke) => joke.id !== id)
    let joke = jokes.find((joke) => joke.id === id)
    joke.votes += offset
    filteredJokes.push(joke)
    filteredJokes.sort((a, b) => b.votes - a.votes)
    setJokes(filteredJokes)
  }, [jokes, setJokes]);

  if (jokes) {
    return (
      <Box className={classes.jokesList}>
        <Box className={classes.jokesListSidebar}>
          <Typography className={classes.jokeListTitle}>
            Dad
            <br />
            Jokes
          </Typography>
          <img
            className={classes.sidebarImage}
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
          />
        </Box>
        <Box className={classes.jokesListJokes}>
          {jokes.map((joke) => {
            return (
              <Joke
                votes={joke.votes}
                text={joke.text}
                upvote={() => {
                    handleVote(joke.id, 1)
                }}
                downvote={() => {
                    handleVote(joke.id, -1)
                }}
                key={joke.id}
              />
            );
          })}
        </Box>
      </Box>
    );
  } else {
    return <h1>Loading Latest Jokes...</h1>;
  }
}