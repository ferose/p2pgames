import React from 'react';
import './Banner.scss';

interface IBannerProps {}

const Banner: React.FC<IBannerProps> = (props) => {
  return (
    <div className="Banner">
      <div id="ad"></div>
    </div>
  );
}

export default Banner;
