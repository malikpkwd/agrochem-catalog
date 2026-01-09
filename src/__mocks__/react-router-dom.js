const React = require('react');

module.exports = {
  Link: ({ children, to }) => React.createElement('a', { href: to }, children),
  useParams: () => ({ id: '1' }),
  BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: ({ element }) => element,
};
