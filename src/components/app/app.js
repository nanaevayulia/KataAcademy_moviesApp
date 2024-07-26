import { Component } from 'react';
import { format } from 'date-fns';

import MoviesDB from '../../services/moviesDB';
import CardList from '../card-list';

import noPoster from './no_poster.jpg';

import './app.css';

export default class App extends Component {
  state = {
    movies: [],
    query: 'return',
    numberPage: 1,
    totalPages: 0,
  };

  constructor() {
    super();
    this.searchMovies('return', 1);
  }

  createItem = (item) => {
    const movieTitle = item.title || 'Untitled';
    const releaseDate = item.release_date ? format(new Date(item.release_date), 'MMMM d, y') : 'No release date';
    const overview = item.overview || 'Without a description';
    let posterURL = `${noPoster}`;
    if (item.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    }

    return {
      id: item.id,
      movieTitle,
      releaseDate,
      overview,
      posterURL,
    };
  };

  addItem = (item) => {
    const newItem = this.createItem(item);

    this.setState(({ movies }) => {
      const newMoviesData = [...movies, newItem];
      return {
        movies: newMoviesData,
      };
    });
  };

  searchMovies() {
    const database = new MoviesDB();
    const { query, numberPage } = this.state;

    database.getMovies(query, numberPage).then((movies) => {
      this.setState({
        totalPages: movies.total_pages,
        numberPage,
      });
      movies.results.forEach((movie) => {
        this.addItem(movie);
      });
    });
  }

  render() {
    return (
      <div className="container">
        <CardList moviesData={this.state.movies} />
      </div>
    );
  }
}
