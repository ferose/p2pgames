import React from 'react';
import './Banner.scss';

interface IBannerProps {}

const Banner: React.FC<IBannerProps> = (props) => {
  return (
    <div className="Banner">
      <div id="ad">
        <h1>PVP Games</h1>
      </div>
    </div>
  );
}

export default Banner;
