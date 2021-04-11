import React from 'react';
import { Image as RNImage } from 'react-native';

const Image = ({ element }) => (
  <RNImage
    source={{ uri: element.url }}
    style={{ width: element.size, height: element.size }}
    resizeMode='contain'
  />
);

export default Image;
