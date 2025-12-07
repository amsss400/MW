import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../components/themes';
import { Icon } from '@rneui/themed';

const Browser: React.FC = () => {
  const { colors } = useTheme();
  const [url, setUrl] = useState('https://app.uniswap.org');
  const [inputUrl, setInputUrl] = useState('https://app.uniswap.org');

  const handleGo = () => {
    let newUrl = inputUrl;
    if (!newUrl.startsWith('http')) {
        newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.urlBar, { backgroundColor: colors.inputBackgroundColor }]}>
        <TextInput
          style={[styles.input, { color: colors.foregroundColor }]}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="Enter URL"
          placeholderTextColor={colors.buttonDisabledTextColor}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={handleGo} style={styles.goButton}>
          <Icon name="arrow-forward" type="material" color={colors.foregroundColor} />
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  goButton: {
    marginLeft: 10,
  },
  webview: {
    flex: 1,
  },
});

export default Browser;
