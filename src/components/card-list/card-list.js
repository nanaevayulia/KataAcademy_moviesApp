import { Component } from 'react';
import PropTypes from 'prop-types';

import { GenresConsumer } from '../genres-context/genres-context';
import CardListItem from '../card-list-item';

import './card-list.css';

export default class CardList extends Component {
  render() {
    const { moviesData, guestId, addRateMovie, deleteRateMovie } = this.props;
    return (
      <div className="card-list">
        <GenresConsumer>
          {({ genres }) => {
            return (
              <CardListItem
                moviesData={moviesData}
                guestId={guestId}
                addRateMovie={addRateMovie}
                deleteRateMovie={deleteRateMovie}
                genresList={genres}
              />
            );
          }}
        </GenresConsumer>
      </div>
    );
  }

  static defaulProps = {
    moviesData: [],
    guestId: '',
    addRateMovie: () => {},
    deleteRateMovie: () => {},
  };

  static propTypes = {
    moviesData: PropTypes.array,
    guestId: PropTypes.string,
    addRateMovie: PropTypes.func,
    deleteRateMovie: PropTypes.func,
  };
}
