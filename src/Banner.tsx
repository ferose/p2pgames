import React from 'react';
import './Banner.css';
import Button from 'react-bootstrap/Button';

interface IBannerProps {
  onMenuClick: () => void;
}

const Banner: React.FC<IBannerProps> = (props) => {
  return (
    <div className="Banner">
      <div id="ad"></div>
      <Button id="menu-button" onClick={props.onMenuClick}>Menu</Button>
    </div>
  );
}

export default Banner;
