import { Component } from 'react';
import { format } from 'date-fns';
import { Spin, Alert, Flex, Empty, Pagination } from 'antd';
import PropTypes from 'prop-types';

import MoviesDB from '../../services/moviesDB';
import { GenresProvider } from '../genres-context/genres-context';
import Header from '../header';
import CardList from '../card-list';
import Search from '../search';

import noPoster from './no_poster.jpg';
import './app.css';

export default class App extends Component {
  database = new MoviesDB();

  state = {
    movies: [],
    query: '',
    numberPage: 1,
    totalPages: 0,
    loading: true,
    error: false,
    notFound: false,
    tab: 'search',
    guestId: '',
    starsList: [],
    genresList: [],
  };

  componentDidMount = () => {
    this.getGenresList();
    this.getGuestId();
    this.getPopularMovies();

    if (localStorage.getItem('starsList')) {
      this.setState({ starsList: JSON.parse(localStorage.getItem('starsList')) });
    }
  };

  getGuestId = () => {
    if (!localStorage.getItem('guestId')) {
      this.database
        .createGuestSession()
        .then((res) => {
          localStorage.setItem('guestId', res);
          this.setState({ guestId: res });
        })
        .catch(this.onError());
    } else {
      this.setState({ guestId: localStorage.getItem('guestId') });
    }
  };

  getGenresList = () => {
    this.database
      .getGenresList()
      .then((body) => {
        this.setState({
          genresList: body,
        });
      })
      .catch(this.onError);
  };

  createItem = (movie) => {
    const movieTitle = movie.title || 'Untitled';
    const popularity = movie.vote_average.toFixed(1) || 0;
    const releaseDate = movie.release_date ? format(new Date(movie.release_date), 'MMMM d, y') : 'No release date';
    const overview = movie.overview || 'Without a description';
    let rating = 0;
    this.state.starsList.map((item) => {
      if (item.id === movie.id) {
        rating = item.rate;
      }
    });
    let posterURL = `${noPoster}`;
    if (movie.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    }
    const genres_ids = movie.genre_ids;

    return {
      id: movie.id,
      movieTitle,
      popularity,
      genres_ids,
      releaseDate,
      overview,
      posterURL,
      rating,
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
    const { query, numberPage } = this.state;
    this.setState({ movies: [], loading: true, error: false, notFound: false, totalPages: 0 });

    if (query === '') {
      this.getPopularMovies();
    } else {
      this.database
        .searchMovies(query, numberPage)
        .then((movies) => {
          this.setState({
            totalPages: movies.total_pages,
            numberPage,
            loading: false,
          });
          if (movies.results.length === 0) {
            this.setState({ loading: false, notFound: true });
          }
          movies.results.forEach((movie) => {
            this.addItem(movie);
          });
        })
        .catch(this.onError);
    }
  }

  getPopularMovies = () => {
    const { numberPage } = this.state;
    this.setState({ movies: [], loading: true, error: false, notFound: false, totalPages: 0 });

    this.database
      .getPopularMovies(numberPage)
      .then((movies) => {
        this.setState({
          totalPages: movies.total_pages,
          numberPage,
          loading: false,
        });
        if (movies.results.length === 0) {
          this.setState({ loading: false, notFound: true });
        }
        movies.results.forEach((movie) => {
          this.addItem(movie);
        });
      })
      .catch(this.onError);
  };

  getRatedMovies() {
    const { numberPage, guestId } = this.state;
    this.setState({ movies: [], loading: true, error: false, notFound: false, totalPages: 0 });

    this.database
      .getRatedMovies(guestId, numberPage)
      .then((movies) => {
        this.setState({
          totalPages: movies.total_pages,
          numberPage,
          loading: false,
        });
        if (movies.results.length === 0) {
          this.setState({ loading: false, notFound: true });
        }
        movies.results.forEach((movie) => {
          this.addItem(movie);
        });
      })
      .catch(this.onError);
  }

  changeTab = (key) => {
    if (key === 'rated') {
      this.setState({ tab: key, numberPage: 1, notFound: false }, () => this.getRatedMovies());
    } else if (key === 'search') {
      this.setState({ tab: key, numberPage: 1, notFound: false }, () => this.getPopularMovies());
    }
  };

  searchQuery = (query) => {
    this.setState({ query, numberPage: 1 }, () => this.searchMovies());
  };

  changePages = (page) => {
    const { tab } = this.state;
    this.setState({ numberPage: page }, () => {
      if (tab === 'search') {
        this.searchMovies();
      } else {
        this.getRatedMovies();
      }
    });
  };

  addRateMovie = (id, rate) => {
    const newRateMovie = { id, rate };
    this.setState(({ starsList }) => {
      let newArr = [];
      const changeRate = starsList.map((item) => item.id === id);
      if (changeRate.length === 0) {
        newArr = [...starsList, newRateMovie];
      } else {
        const filterArr = starsList.filter((item) => item.id !== id);
        newArr = [...filterArr, newRateMovie];
      }

      return {
        starsList: newArr,
      };
    });
  };

  deleteRateMovie = (id) => {
    this.setState(({ starsList }) => {
      const newArr = starsList.filter((item) => item.id !== id);
      return {
        starsList: newArr,
      };
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false, notFound: false });
  };

  render() {
    const { movies, loading, error, notFound, numberPage, totalPages, tab, guestId } = this.state;

    const search = tab === 'search' ? <Search searchQuery={this.searchQuery} /> : null;

    const errorMessage = error ? (
      <Alert message="Ошибка!" description="К сожалению, запрашиваемая вами страница не найдена..." type="error" />
    ) : null;
    const spin = loading ? <Spin size="large" /> : null;
    const content = !notFound ? (
      <CardList
        moviesData={movies}
        guestId={guestId}
        addRateMovie={this.addRateMovie}
        deleteRateMovie={this.deleteRateMovie}
      />
    ) : (
      <Empty description="Поиск не дал результатов" />
    );
    const pagination =
      totalPages > 0 && !loading && !notFound ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={totalPages * 10}
          showSizeChanger={false}
          onChange={this.changePages}
        />
      ) : null;

    return (
      <div className="container">
        <GenresProvider value={{ genres: this.state.genresList }}>
          <Header onChangeTab={this.changeTab} />
          {search}
          <Flex vertical align="center">
            {errorMessage}
            {spin}
            {content}
            {pagination}
          </Flex>
        </GenresProvider>
      </div>
    );
  }

  static defaulProps = {
    movies: [],
    query: '',
    numberPage: 1,
    totalPages: 0,
    loading: true,
    error: false,
    notFound: false,
    tab: 'search',
    guestId: '',
    starsList: [],
    genresList: [],
  };

  static propTypes = {
    movies: PropTypes.array,
    query: PropTypes.string,
    numberPage: PropTypes.number,
    totalPages: PropTypes.number,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    notFound: PropTypes.bool,
    tab: PropTypes.oneOf(['search', 'rated']),
    guestId: PropTypes.string,
    starsList: PropTypes.array,
    genresList: PropTypes.array,
  };
}
