import React from 'react';

import Markdown from './Markdown';

const Text = ({ element }) => (
  <Markdown>
    {element.text}
  </Markdown>
);

export default Text;
