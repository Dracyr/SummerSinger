import React, { PropTypes } from 'react';

/*
  Credit to: https://forums.mp3tag.de/lofiversion/index.php?t19001.html

  Rating   WMP 12         Win 8.1 Explor   Winamp v5.666   foobar2000 1.3.2   Clementine 1.2.3   MediaMonkey 4.1.2   MusicBee 2.3.5188
  stars    writes         writes           writes          writes             writes             writes              writes
  -------  ---------------------------------------------------------------------------------------------------------------------------
  unrated  0 or no POPM   0 or no POPM     0 or no POPM    0 or no POPM       0 or no POPM       no POPM             no POPM

  0        ---            ---              ---             ---                ---                  0                   0
  0.5      ---            ---              ---             ---                ---                 13                  13
  1          1              1                1               1                  1                  1                   1
  1.5      ---            ---              ---             ---                ---                 54                  54
  2         64             64               64              64                 64                 64                  64
  2.5      ---            ---              ---             ---                ---                118                 118
  3        128            128              128             128                128                128                 128
  3.5      ---            ---              ---             ---                ---                186                 186
  4        196            196              196             196                192                196                 196
  5        255            255              255             255                255                255                 255
  4.5      ---            ---              ---             ---                ---                242                 242
*/
const StarRating = (props) => {
  const conversion = {
    0: 0,
    13: 0.5,
    1: 1,
    54: 1.5,
    64: 2,
    118: 2.5,
    128: 3,
    186: 3.5,
    196: 4,
    255: 5,
    242: 4.5,
  };
  const stars = conversion[props.rating] || 0;
  const halfStar = stars - Math.floor(stars) === 0.5;

  return (
    <span>
      {[...Array(Math.floor(stars))].map((x, i) =>
        <i key={i} className="fa fa-star"></i>
      )}

      {halfStar ? <i className="fa fa-star-half-o"></i> : ''}

      {[...Array(5 - Math.floor(stars) - (halfStar ? 1 : 0))].map((x, i) =>
        <i key={Math.floor(stars) + i} className="fa fa-star-o"></i>
      )}
    </span>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
};

export default StarRating;
