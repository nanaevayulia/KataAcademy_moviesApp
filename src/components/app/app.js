import { Component } from 'react';
import { format } from 'date-fns';
import { Spin, Alert, Space, Empty, Pagination } from 'antd';

import MoviesDB from '../../services/moviesDB';
import CardList from '../card-list';
import Search from '../search';

import noPoster from './no_poster.jpg';
import './app.css';

export default class App extends Component {
  state = {
    movies: [],
    query: '',
    numberPage: 1,
    totalPages: 0,
    loading: true,
    error: false,
    notFound: false,
  };

  // componentDidMount = () => {
  //   this.searchMovies();
  // };

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
    this.setState({ movies: [], loading: true, error: false, notFound: false, totalPages: 0 });

    database
      .getMovies(query, numberPage)
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

  searchQuery = (query) => {
    this.setState({ query, numberPage: 1 }, () => this.searchMovies());
  };

  changePages = (page) => {
    this.setState({ numberPage: page }, () => {
      this.searchMovies();
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false, notFound: false });
  };

  render() {
    const { movies, loading, error, notFound, numberPage, totalPages } = this.state;

    const errorMessage = error ? (
      <Alert message="Ошибка!" description="К сожалению, запрашиваемая вами страница не найдена..." type="error" />
    ) : null;
    const spin = loading ? <Spin size="large" /> : null;
    const content = !notFound ? <CardList moviesData={movies} /> : <Empty description="Поиск не дал результатов" />;
    const pagination =
      totalPages > 0 && !loading && !notFound ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={totalPages}
          showSizeChanger={false}
          onChange={this.changePages}
        />
      ) : null;

    return (
      <div className="container">
        <Search searchQuery={this.searchQuery} />
        <Space direction="vertical" size="middle" align="center">
          {errorMessage}
          {spin}
          {content}
          {pagination}
        </Space>
      </div>
    );
  }
}
