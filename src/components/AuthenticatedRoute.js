import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthenticatedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props => (cProps.isAuthenticated
      ? <C {...props} {...cProps} />
      : (
        <Redirect
          to={
              `/login?redirect=${props.location.pathname}${props.location.search}`
            }
        />
      ))}
  />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  props: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};

AuthenticatedRoute.defaultProps = {
  location: {
    pathname: '',
    search: '',
  },
};

export default AuthenticatedRoute;
