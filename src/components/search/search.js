import { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import './search.css';

export default class Search extends Component {
  onSearch = (e) => {
    const { searchQuery } = this.props;
    const userSearch = e.target.value.trim().replace(/ +/g, ' ');
    searchQuery(userSearch);
  };

  render() {
    return <Input className="search" placeholder="Type to search..." onChange={debounce(this.onSearch, 1000)} />;
  }

  static defaulProps = {
    searchQuery: () => {},
  };

  static propTypes = {
    searchQuery: PropTypes.func,
  };
}
