import { Component } from 'react';

import CardListItem from '../card-list-item';

import './card-list.css';

export default class CardList extends Component {
  render() {
    const { moviesData } = this.props;
    return (
      <div className="card-list">
        <CardListItem moviesData={moviesData} />
      </div>
    );
  }
}
