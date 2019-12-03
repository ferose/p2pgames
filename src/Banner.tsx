import React from 'react';
import './Banner.css';
import Button from 'react-bootstrap/Button';

const Banner: React.FC = () => {
  return (
    <div className="Banner">
      <div className="ad"></div>
      <Button className="menu-button">Menu</Button>
    </div>
  );
}

export default Banner;
