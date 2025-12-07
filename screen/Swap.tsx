import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../components/themes';
import Button from '../components/Button';
import { SwapService } from '../class/services/swap-service';

const Swap: React.FC = () => {
  const { colors } = useTheme();
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState('WETH');
  const [buyToken, setBuyToken] = useState('USDC');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetQuote = async () => {
    if (!sellAmount) return;
    setLoading(true);
    try {
      const q = await SwapService.getQuote({
          buyToken: buyToken,
          sellToken: sellToken,
          sellAmount: (Number(sellAmount) * 1e18).toString(), // simplified wei conversion
      });
      setQuote(q);
    } catch (e: any) {
        Alert.alert('Error', e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foregroundColor }]}>Swap</Text>

        <TextInput
          style={[styles.input, { color: colors.foregroundColor, backgroundColor: colors.inputBackgroundColor }]}
          value={sellAmount}
          onChangeText={setSellAmount}
          placeholder="Amount"
          placeholderTextColor={colors.buttonDisabledTextColor}
          keyboardType="numeric"
        />

        {/* Inputs for testing other pairs */}
        <TextInput
          style={[styles.input, { color: colors.foregroundColor, backgroundColor: colors.inputBackgroundColor }]}
          value={sellToken}
          onChangeText={setSellToken}
          placeholder="Sell Token (e.g. WETH)"
          placeholderTextColor={colors.buttonDisabledTextColor}
          autoCapitalize="characters"
        />
        <TextInput
          style={[styles.input, { color: colors.foregroundColor, backgroundColor: colors.inputBackgroundColor }]}
          value={buyToken}
          onChangeText={setBuyToken}
          placeholder="Buy Token (e.g. USDC)"
          placeholderTextColor={colors.buttonDisabledTextColor}
          autoCapitalize="characters"
        />

        <Button title="Get Quote" onPress={handleGetQuote} disabled={loading} />

        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

        {quote && (
            <View style={styles.result}>
                <Text style={{ color: colors.foregroundColor }}>
                    Buy Amount: {quote.buyAmount ? (Number(quote.buyAmount) / 1e6).toFixed(2) : '0'} USDC
                </Text>
                 <Text style={{ color: colors.foregroundColor }}>
                    Price: {quote.price}
                </Text>
                 <Text style={{ color: colors.foregroundColor, fontSize: 10, marginTop: 10 }}>
                    1% Fee included for MalinWallet
                </Text>
            </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  result: {
      marginTop: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8
  }
});

export default Swap;
