import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './LoaderButton.scss';

const LoaderButton = ({
  isLoading,
  text,
  loadingText,
  className = '',
  disabled = false,
  ...props
}) => (
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
    {!isLoading ? text : loadingText}
  </Button>
);

LoaderButton.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string,
  loadingText: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

LoaderButton.defaultProps = {
  isLoading: false,
  text: '',
  loadingText: '',
  className: '',
  disabled: false,
};

export default LoaderButton;
