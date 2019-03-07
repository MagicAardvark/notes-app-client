import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const querystring = (pageName, url = window.location.href) => {
  const name = pageName.replace(/[[]]/g, '\\$&');

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const UnauthenticatedRoute = ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring('redirect');
  return (
    <Route
      {...rest}
      render={props => (!cProps.isAuthenticated
        ? <C {...props} {...cProps} />
        : (
          <Redirect
            to={redirect === '' || redirect === null ? '/' : redirect}
          />
        ))}
    />
  );
};

UnauthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  props: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default UnauthenticatedRoute;
