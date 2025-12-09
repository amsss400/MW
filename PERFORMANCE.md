# 🚀 MalinWallet Performance & Optimization Guide

## Table of Contents
1. [Bundle Size Optimization](#bundle-size-optimization)
2. [Runtime Performance](#runtime-performance)
3. [Memory Management](#memory-management)
4. [Network Optimization](#network-optimization)
5. [Build Optimization](#build-optimization)
6. [Monitoring & Metrics](#monitoring--metrics)

---

## Bundle Size Optimization

### 📊 Current Bundle Analysis

```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/stats.json

# React Native specific
npm install --save-dev react-native-bundle-visualizer
```

### ✅ Optimization Strategies

#### 1. **Code Splitting**
```typescript
// Use lazy loading for screens
import { lazy, Suspense } from 'react';

const WalletScreen = lazy(() => import('./screens/WalletScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

export const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <WalletScreen />
  </Suspense>
);
```

#### 2. **Tree Shaking**
```json
{
  "sideEffects": false,
  "module": "dist/index.esm.js",
  "main": "dist/index.cjs.js"
}
```

#### 3. **Minification & Compression**
```bash
# Metro bundler configuration
metro.config.js:

module.exports = {
  transformer: {
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      compress: {
        passes: 2,
      },
    },
  },
};
```

#### 4. **Remove Unused Dependencies**
```bash
# Find unused packages
npm install -g depcheck
depcheck

# Remove unused
npm prune
```

### 📈 Target Metrics
- Android APK: < 50MB
- iOS IPA: < 100MB
- JavaScript Bundle: < 2MB

---

## Runtime Performance

### ⚡ React Native Optimization

#### 1. **FlatList Performance**
```typescript
import { FlatList } from 'react-native';

const TransactionList = ({ transactions }) => (
  <FlatList
    data={transactions}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <TransactionItem transaction={item} />}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    updateCellsBatchingPeriod={50}
    initialNumToRender={10}
    windowSize={10}
  />
);
```

#### 2. **Memoization**
```typescript
import { memo, useMemo, useCallback } from 'react';

const WalletBalance = memo(({ balance, currency }) => {
  const formattedBalance = useMemo(
    () => formatCurrency(balance, currency),
    [balance, currency]
  );

  const handlePress = useCallback(() => {
    // Handle press
  }, []);

  return <Text>{formattedBalance}</Text>;
});
```

#### 3. **Image Optimization**
```typescript
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ source }) => (
  <FastImage
    source={source}
    style={{ width: 200, height: 200 }}
    resizeMode={FastImage.resizeMode.contain}
    cache={FastImage.cacheControl.immutable}
  />
);
```

#### 4. **Animation Performance**
```typescript
import { useNativeDriver } from 'react-native-reanimated';

const AnimatedComponent = () => {
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value }],
  }));

  return (
    <Animated.View style={[styles.box, animatedStyle]} />
  );
};
```

---

## Memory Management

### 🧠 Memory Leak Prevention

#### 1. **Cleanup in useEffect**
```typescript
useEffect(() => {
  const subscription = eventEmitter.subscribe('event', handler);
  const timer = setTimeout(() => {}, 1000);

  return () => {
    subscription.unsubscribe();
    clearTimeout(timer);
  };
}, []);
```

#### 2. **Proper Navigation Cleanup**
```typescript
useFocusEffect(
  useCallback(() => {
    // Initialize when screen is focused
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Cleanup when leaving screen
    });

    return unsubscribe;
  }, [navigation])
);
```

#### 3. **Database Connection Management**
```typescript
class DatabaseService {
  private static instance: DatabaseService;
  private realm: Realm | null = null;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (!this.realm) {
      this.realm = await Realm.open({ schema: [UserSchema] });
    }
  }

  async disconnect(): Promise<void> {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
    }
  }
}
```

#### 4. **WebSocket Connection Pooling**
```typescript
class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private maxConnections = 5;

  getConnection(url: string): WebSocket {
    if (this.connections.has(url)) {
      return this.connections.get(url)!;
    }

    if (this.connections.size >= this.maxConnections) {
      const firstKey = this.connections.keys().next().value;
      this.connections.get(firstKey)?.close();
      this.connections.delete(firstKey);
    }

    const ws = new WebSocket(url);
    this.connections.set(url, ws);
    return ws;
  }
}
```

---

## Network Optimization

### 🌐 API Request Optimization

#### 1. **Request Batching**
```typescript
class RequestBatcher {
  private queue: Array<{ url: string; resolve: Function; reject: Function }> = [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize = 10;
  private batchDelay = 100; // ms

  async batch(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;

    const batch = this.queue.splice(0, this.batchSize);
    const urls = batch.map((item) => item.url);

    try {
      const results = await Promise.all(
        urls.map((url) => fetch(url))
      );
      batch.forEach((item, index) => item.resolve(results[index]));
    } catch (error) {
      batch.forEach((item) => item.reject(error));
    }
  }
}
```

#### 2. **Response Caching**
```typescript
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  async fetch(url: string): Promise<any> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const response = await fetch(url);
    const data = await response.json();
    this.cache.set(url, { data, timestamp: Date.now() });
    return data;
  }

  invalidate(url: string): void {
    this.cache.delete(url);
  }
}
```

#### 3. **Compression**
```typescript
const createCompressedClient = () => {
  return axios.create({
    headers: {
      'Accept-Encoding': 'gzip, deflate',
      'Content-Encoding': 'gzip',
    },
  });
};
```

---

## Build Optimization

### 🔨 Android Build Optimization

```gradle
// android/app/build.gradle

android {
  compileSdkVersion 34
  
  buildTypes {
    release {
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
      
      // Enable R8 compiler
      useProguard false
    }
  }

  packagingOptions {
    exclude 'META-INF/proguard/androidx-*.pro'
    exclude 'META-INF/DEPENDENCIES'
  }
}
```

### 🍎 iOS Build Optimization

```swift
// ios/MalinWallet/Info.plist

<dict>
  <key>UILaunchStoryboardName</key>
  <string>LaunchScreen</string>
  <key>NSBonjourServices</key>
  <array/>
  <key>NSLocalNetworkUsageDescription</key>
  <string>MalinWallet needs local network access</string>
</dict>
```

---

## Monitoring & Metrics

### 📊 Performance Monitoring

#### 1. **React Native Performance Monitor**
```typescript
import { PerformanceObserver, performance } from 'perf_hooks';

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });

// Mark performance
performance.mark('wallet-load-start');
// ... do work
performance.mark('wallet-load-end');
performance.measure('wallet-load', 'wallet-load-start', 'wallet-load-end');
```

#### 2. **Crash Reporting**
```typescript
import Bugsnag from '@bugsnag/react-native';

Bugsnag.start({
  apiKey: 'YOUR_API_KEY',
  enabledReleaseStages: ['production'],
  releaseStage: __DEV__ ? 'development' : 'production',
});

// Automatic error tracking
Bugsnag.notify(new Error('Something went wrong'));
```

#### 3. **Analytics**
```typescript
import analytics from '@react-native-firebase/analytics';

const trackEvent = async (name: string, params?: any) => {
  await analytics().logEvent(name, params);
};

// Usage
await trackEvent('wallet_created', { currency: 'BTC' });
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|----------|
| App Launch Time | < 2s | - |
| Screen Transition | < 300ms | - |
| Transaction List Scroll | 60 FPS | - |
| Memory Usage | < 150MB | - |
| Battery Impact | < 5% per hour | - |
| Network Latency | < 500ms | - |

---

## Continuous Optimization

```bash
# Monitor performance in CI/CD
./scripts/performance-test.sh

# Generate performance report
npm run performance:report

# Compare with baseline
npm run performance:compare
```

---

**Last Updated:** 2025-12-09
**Status:** Active
**Maintainer:** MalinWallet Performance Team
