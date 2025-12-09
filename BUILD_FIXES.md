# 🐛 MalinWallet - Guide de Correction des Bugs de Build

## Table of Contents
1. [Erreurs Communes de Build](#erreurs-communes-de-build)
2. [Corrections Android](#corrections-android)
3. [Corrections iOS](#corrections-ios)
4. [Corrections Metro/TypeScript](#corrections-metrotypescript)
5. [Dépendances Problématiques](#dépendances-problématiques)
6. [Commandes de Nettoyage](#commandes-de-nettoyage)

---

## Erreurs Communes de Build

### ❌ Erreur 1: "Cannot find module" ou "Module not found"

**Cause:** Dépendances manquantes ou mal installées

**Solution:**
```bash
# Nettoyer complètement
rm -rf node_modules package-lock.json
npm cache clean --force

# Réinstaller
npm install

# Vérifier les dépendances
npm ls
```

### ❌ Erreur 2: "Gradle build failed" ou "Build failed"

**Cause:** Problèmes de configuration Gradle ou dépendances Android

**Solution:**
```bash
cd android
./gradlew clean
./gradlew build --stacktrace

# Si ça ne marche pas
./gradlew build --debug
```

### ❌ Erreur 3: "Metro bundler error" ou "Cannot resolve module"

**Cause:** Configuration Metro incorrecte ou alias mal configurés

**Solution:**
```bash
# Nettoyer le cache Metro
rm -rf /tmp/metro-cache
npm start -- --reset-cache
```

### ❌ Erreur 4: "TypeScript compilation error"

**Cause:** Erreurs TypeScript ou types manquants

**Solution:**
```bash
npm run tslint
npm run lint:fix
```

---

## Corrections Android

### 🔧 Fix 1: Erreur de Package Name

**Problème:** `io.bluewallet.bluewallet` vs `com.malinwallet.app`

**Correction:**
```bash
# Vérifier tous les fichiers
grep -r "io.bluewallet.bluewallet" android/

# Remplacer partout
find android -type f \( -name "*.gradle" -o -name "*.xml" -o -name "*.kt" -o -name "*.java" \) \
  -exec sed -i 's/io\.bluewallet\.bluewallet/com.malinwallet.app/g' {} \;
```

### 🔧 Fix 2: Erreur de Compilation Kotlin

**Problème:** `error: unresolved reference` ou `Cannot access class`

**Correction dans `android/app/build.gradle`:**
```gradle
android {
    compileSdkVersion 35
    buildToolsVersion "35.0.0"
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }
    
    kotlinOptions {
        jvmTarget = '11'
        freeCompilerArgs += [
            "-Xopt-in=kotlin.ExperimentalStdlibApi",
            "-Xopt-in=kotlin.RequiresOptIn"
        ]
    }
}
```

### 🔧 Fix 3: Erreur de Dépendances Gradle

**Problème:** `Duplicate class` ou `Conflict with dependency`

**Correction dans `android/app/build.gradle`:**
```gradle
dependencies {
    // Exclure les dépendances conflictuelles
    implementation('com.facebook.react:react-android') {
        exclude group: 'com.google.android.gms'
    }
    
    // Utiliser les versions correctes
    implementation 'androidx.appcompat:appcompat:1.7.1'
    implementation 'androidx.core:core-ktx:1.16.0'
    implementation 'com.google.android.material:material:1.12.0'
}
```

### 🔧 Fix 4: Erreur de Ressources Android

**Problème:** `Resource not found` ou `Duplicate resource`

**Correction:**
```bash
# Nettoyer les ressources
cd android
./gradlew clean
./gradlew cleanBuildCache

# Reconstruire
./gradlew assembleDebug
```

### 🔧 Fix 5: Erreur de Manifest

**Problème:** `Manifest merger failed` ou `Duplicate activity`

**Correction dans `android/app/src/main/AndroidManifest.xml`:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:installLocation="auto">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:largeHeap="true"
        android:theme="@style/AppTheme"
        tools:replace="android:allowBackup">

        <!-- Activities -->
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## Corrections iOS

### 🔧 Fix 1: Erreur de Pod Installation

**Problème:** `pod install` échoue ou `CocoaPods error`

**Correction:**
```bash
cd ios

# Nettoyer
rm -rf Pods Podfile.lock

# Réinstaller
pod repo update
pod install --repo-update

# Si ça ne marche pas
pod install --repo-update --verbose
```

### 🔧 Fix 2: Erreur de Bundle Identifier

**Problème:** `Bundle identifier mismatch` ou `Provisioning profile error`

**Correction:**
1. Ouvrir `ios/MalinWallet.xcodeproj` dans Xcode
2. Sélectionner le target "MalinWallet"
3. Aller à "Build Settings"
4. Chercher "Bundle Identifier"
5. Mettre à jour à `com.malinwallet.app`

### 🔧 Fix 3: Erreur de Compilation Swift

**Problème:** `error: cannot find 'X' in scope` ou `Type mismatch`

**Correction dans `ios/MalinWallet/Info.plist`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>7.2.3</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
</dict>
</plist>
```

### 🔧 Fix 4: Erreur de Linking

**Problème:** `Undefined symbols for architecture` ou `ld: symbol not found`

**Correction:**
```bash
cd ios

# Nettoyer le build
xcodebuild clean -workspace MalinWallet.xcworkspace -scheme MalinWallet

# Reconstruire
xcodebuild -workspace MalinWallet.xcworkspace -scheme MalinWallet -configuration Debug
```

---

## Corrections Metro/TypeScript

### 🔧 Fix 1: Erreur de Module Resolution

**Problème:** `Cannot find module` ou `Module not found`

**Correction dans `metro.config.js`:**
```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      net: require.resolve('react-native-tcp-socket'),
      tls: require.resolve('react-native-tcp-socket'),
      buffer: require.resolve('buffer'),
      events: require.resolve('events'),
      url: require.resolve('url'),
    },
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
    assetExts: ['png', 'gif', 'jpg', 'jpeg', 'bmp', 'psd', 'svg', 'webp', 'm4v', 'mov', 'mp4', 'mpeg', 'mpg', 'webm', 'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav', 'html', 'pdf'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 🔧 Fix 2: Erreur TypeScript

**Problème:** `Type 'X' is not assignable to type 'Y'`

**Correction dans `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "react",
    "lib": ["es2020"],
    "noEmit": true,
    "strict": true,
    "target": "esnext",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "module": "esnext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": false,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "extends": "@react-native/typescript-config/tsconfig.json",
  "exclude": ["node_modules", "babel.config.js", "jest.config.js", "scripts"]
}
```

### 🔧 Fix 3: Erreur de Babel

**Problème:** `SyntaxError: Unexpected token` ou `Babel error`

**Correction dans `babel.config.js`:**
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '@screens': './src/screens',
          '@components': './src/components',
          '@services': './src/services',
          '@utils': './src/utils',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
```

---

## Dépendances Problématiques

### ⚠️ Dépendances à Vérifier

```json
{
  "dependencies": {
    "react-native": "0.78.2",
    "react": "19.0.0",
    "bitcoinjs-lib": "7.0.0",
    "ethers": "^6.16.0",
    "@solana/web3.js": "^1.98.4",
    "realm": "20.1.0",
    "react-native-keychain": "9.1.0",
    "react-native-biometrics": "3.0.1"
  }
}
```

### 🔧 Fix: Dépendances Incompatibles

```bash
# Vérifier les dépendances
npm ls

# Auditer les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Mettre à jour les dépendances
npm update

# Vérifier les versions
npm outdated
```

---

## Commandes de Nettoyage

### 🧹 Nettoyage Complet

```bash
# Nettoyage total
npm run clean

# Ou manuellement
rm -rf node_modules package-lock.json
rm -rf android/.gradle android/app/build
rm -rf ios/Pods ios/Podfile.lock
rm -rf /tmp/metro-cache

# Réinstaller
npm install
cd ios && pod install && cd ..
```

### 🧹 Nettoyage Android

```bash
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..
```

### 🧹 Nettoyage iOS

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### 🧹 Nettoyage Metro

```bash
rm -rf /tmp/metro-cache
npm start -- --reset-cache
```

---

## Checklist de Débogage

- [ ] Vérifier les versions de Node et npm
- [ ] Vérifier les versions de Java et Gradle
- [ ] Vérifier les versions de Xcode et CocoaPods
- [ ] Nettoyer les caches (npm, Gradle, Metro)
- [ ] Réinstaller les dépendances
- [ ] Vérifier les erreurs TypeScript
- [ ] Vérifier les erreurs Gradle
- [ ] Vérifier les erreurs Xcode
- [ ] Vérifier les erreurs Metro
- [ ] Tester le build Android
- [ ] Tester le build iOS
- [ ] Tester sur un appareil réel

---

## Ressources Utiles

- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Gradle Documentation](https://gradle.org/)
- [Xcode Build Settings](https://developer.apple.com/documentation/xcode/build-settings-reference)
- [Metro Documentation](https://facebook.github.io/metro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** 2025-12-09
**Status:** Active
**Maintainer:** MalinWallet Development Team
