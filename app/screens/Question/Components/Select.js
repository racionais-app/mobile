import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Markdown from './Markdown';

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 8
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8
  },
  selected: {
    backgroundColor: 'blue'
  },
  text: {
    marginHorizontal: 8
  },
  separator: {
    height: 8
  }
});

const Separator = () => (
  <View style={styles.separator} />
);

const Option = ({ option, onChange, isSelected }) => (
  <TouchableOpacity onPress={() => onChange(option.id)}>
    <View style={styles.option}>
      <View style={[styles.checkbox, isSelected && styles.selected]} />
      <Markdown>{option.text}</Markdown>
    </View>
  </TouchableOpacity>
);

const Select = ({
  options,
  isMultiselect,
  onSelect,
  element
}) => {
  const [selection, setSelection] = useState([]);

  const onChange = (optionId) => {
    if (isMultiselect) {
      if (!selection.includes(optionId)) {
        setSelection([...selection, optionId]);
      } else {
        setSelection(selection.filter(option => option !== optionId));
      }
    } else {
      setSelection([optionId]);
    }
  }

  useEffect(() => {
    onSelect(selection.sort((a, b) => a - b));
  }, [selection]);

  return (
    <FlatList
      data={options}
      renderItem={({ item }) => {
        const isSelected = selection.includes(item.id);
        return <Option option={item} onChange={onChange} isSelected={isSelected} />
      }}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={() => <Markdown>{element.label}</Markdown>}
      ItemSeparatorComponent={() => <Separator />}
      scrollEnabled={false}
    />
  );
}

export default Select;
