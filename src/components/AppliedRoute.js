import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const AppliedRoute = ({
  component: C,
  props: cProps,
  ...rest
}) => <Route {...rest} render={props => <C {...props} {...cProps} />} />;

AppliedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  props: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default AppliedRoute;
