import React from 'react';
import RNMarkdown from 'react-native-markdown-display';

const styles = {
  text: {
    fontSize: 16
  }
};

const Markdown = ({ children }) => (
  <RNMarkdown style={styles}>
    {children}
  </RNMarkdown>
);

export default Markdown;
