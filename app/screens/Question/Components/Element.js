import React from 'react';

import Text from './Text';
import Select from './Select';
import Input from './Input';
import Image from './Image';

const Element = ({ element, onChange, items, index, onContinue }) => {
  switch (element.type) {
    case 'text':
      return (
        <Text
          element={element}
        />
      );
    case 'image':
      return (
        <Image
          element={element}
        />
      );
    case 'input':
      return (
        <Input
          element={element}
          onChange={onChange}
          onContinue={onContinue}
          items={items}
          index={index}
        />
      );
    case 'select':
      return (
        <Select
          element={element}
          options={element.options}
          onSelect={optionIds => onChange(element.id, optionIds)}
          isMultiselect={false}
        />
      );
    case 'multi-select':
      return (
        <Select
          element={element}
          options={element.options}
          onSelect={optionIds => onChange(element.id, optionIds)}
          isMultiselect
        />
      );
    default:
      return null;
  }
}

export default Element;
