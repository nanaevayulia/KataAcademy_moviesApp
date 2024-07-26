import { Component } from 'react';
import { Tag, Typography } from 'antd';

import './card-list-item.css';

export default class CardListItem extends Component {
  overviewLength = 200;

  getTrimText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.slice(0, text.indexOf(' ', length)) + '...';
  };

  render() {
    const { Title, Text } = Typography;

    const listItems = this.props.moviesData.map((item) => {
      const { id, movieTitle, releaseDate, overview, posterURL } = item;
      const overviewTrim = this.getTrimText(overview, this.overviewLength);

      return (
        <div className="card-list-item" key={id}>
          <img className="card-img" alt={`poster ${movieTitle}`} src={posterURL} />
          <div className="card-info">
            <Title level={4} className="card-movie-title">
              {movieTitle}
            </Title>
            <Text type="secondary" className="card-date">
              {releaseDate}
            </Text>
            <div className="card-tags">
              <Tag>Drama</Tag>
              <Tag>Action</Tag>
            </div>
            <Text className="card-overview">{overviewTrim}</Text>
          </div>
        </div>
      );
    });

    return listItems;
  }
}
