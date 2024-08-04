import { Component } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import './header.css';

export default class Header extends Component {
  items = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];

  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey="search"
          items={this.items}
          centered={true}
          tabBarStyle={{ margin: '0 auto 20px' }}
          tabBarGutter={16}
          onChange={this.props.onChangeTab}
        />
      </div>
    );
  }

  static defaulProps = {
    onChangeTab: () => {},
  };

  static propTypes = {
    onChangeTab: PropTypes.func,
  };
}
