import { Component } from 'react';
import { Tag, Typography, Rate, Flex } from 'antd';
import PropTypes from 'prop-types';

import MoviesDB from '../../services/moviesDB';

import './card-list-item.css';

export default class CardListItem extends Component {
  database = new MoviesDB();
  overviewLength = 150;

  getTrimText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.slice(0, text.indexOf(' ', length)) + '...';
  };

  render() {
    const { Title, Text } = Typography;
    const { moviesData, guestId, genresList, addRateMovie, deleteRateMovie } = this.props;

    const listItems = moviesData.map((item) => {
      const { id, movieTitle, popularity, releaseDate, genres_ids, overview, posterURL, rating } = item;
      const overviewTrim = this.getTrimText(overview, this.overviewLength);

      let popularityClass = 'card-popularity';
      if (popularity < 3) {
        popularityClass += ' red';
      } else if (popularity < 5) {
        popularityClass += ' orange';
      } else if (popularity < 7) {
        popularityClass += ' yellow';
      } else if (popularity >= 7) {
        popularityClass += ' green';
      }

      const rateOnChange = (rate) => {
        if (rate === 0) {
          this.database.deleteMovieRating(guestId, id);
          deleteRateMovie(id);
        } else {
          this.database.setMovieRating(guestId, id, rate);
          addRateMovie(id, rate);
        }
      };

      const genres = genresList.filter((item) => genres_ids.includes(item.id));

      return (
        <div className="card-list-item" key={id}>
          <img className="card-img" alt={`poster ${movieTitle}`} src={posterURL} />
          <Flex justify={'space-between'} gap="middle" className="card-info">
            <Title level={4} className="card-movie-title">
              {movieTitle}
            </Title>
            <div className={popularityClass}>{popularity}</div>
          </Flex>
          <Text type="secondary" className="card-date">
            {releaseDate}
          </Text>
          <div className="card-tags">
            {genres.map((item) => {
              return (
                <Tag key={item.id}>
                  <span>{item.name}</span>
                </Tag>
              );
            })}
          </div>
          <Text className="card-overview">{overviewTrim}</Text>
          <Flex className="card-stars" justify={'flex-end'}>
            <Rate allowHalf count={10} onChange={rateOnChange} defaultValue={rating} />
          </Flex>
        </div>
      );
    });

    return listItems;
  }

  static defaulProps = {
    moviesData: [],
    guestId: '',
    addRateMovie: () => {},
    deleteRateMovie: () => {},
    genresList: [],
  };

  static propTypes = {
    moviesData: PropTypes.array,
    guestId: PropTypes.string,
    addRateMovie: PropTypes.func,
    deleteRateMovie: PropTypes.func,
    genresList: PropTypes.array,
  };
}
