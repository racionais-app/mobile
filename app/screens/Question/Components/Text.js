import React from 'react';

import Markdown from './Markdown';

const Text = ({ element }) => (
  <Markdown>
    {element.text.toString()}
  </Markdown>
);

export default Text;
