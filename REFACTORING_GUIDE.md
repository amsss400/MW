# 🔄 Guide de Refactorisation MalinWallet

## Vue d'ensemble
Ce guide documente la refactorisation complète du projet de BlueWallet vers MalinWallet, incluant le rebranding, la sécurité, et l'optimisation.

---

## 1️⃣ REFACTORISATION ANDROID

### 1.1 Package Identifiers

**Ancien :** `io.bluewallet.bluewallet`
**Nouveau :** `com.malinwallet.app`

#### Fichiers à mettre à jour :

```bash
# Build configuration
android/app/build.gradle
  - namespace: io.bluewallet.bluewallet → com.malinwallet.app
  - applicationId: io.bluewallet.bluewallet → com.malinwallet.app

# BUCK configuration
android/app/BUCK
  - package: io.bluewallet.bluewallet → com.malinwallet.app

# Kotlin source files
android/app/src/main/java/io/bluewallet/bluewallet/
  - Renommer le répertoire en: android/app/src/main/java/com/malinwallet/app/
  - Mettre à jour les déclarations de package dans tous les fichiers .kt

# Test files
android/app/src/androidTest/java/io/bluewallet/bluewallet/
  - Renommer en: android/app/src/androidTest/java/com/malinwallet/app/
  - Mettre à jour les déclarations de package
```

### 1.2 AndroidManifest.xml

```xml
<!-- Notifications -->
<meta-data
    android:name="com.dieam.reactnativepushnotification.notification_channel_name"
    android:value="MalinWallet notifications" />

<!-- Activity Alias -->
<activity-alias
    android:name=".SettingsActivityAlias"
    android:label="MalinWallet Settings"
    ...

<!-- Deep Links -->
<data android:scheme="malinwallet" />
<data android:scheme="mw" />
<!-- Supprimer: bluewallet, blue -->
```

### 1.3 Fichiers Kotlin

**MainActivity.kt**
```kotlin
package com.malinwallet.app

// Mettre à jour tous les imports et références
```

**ThemeHelper.kt, SettingsActivity.kt, MarketWidget.kt**
```kotlin
package com.malinwallet.app
```

---

## 2️⃣ REFACTORISATION iOS

### 2.1 Bundle Identifiers

**Ancien :** `io.bluewallet.bluewallet`
**Nouveau :** `com.malinwallet.app`

#### Fichiers à mettre à jour :

```bash
# Info.plist
ios/BlueWallet/Info.plist
  - BGTaskSchedulerPermittedIdentifiers: io.bluewallet.bluewallet.* → com.malinwallet.app.*

# Xcode project (via Xcode UI ou pbxproj)
ios/BlueWallet.xcodeproj/project.pbxproj
  - PRODUCT_BUNDLE_IDENTIFIER: io.bluewallet.bluewallet → com.malinwallet.app

# Handoff identifiers
ios/BlueWalletWatch/Objects/Handoff.swift
  - ReceiveOnchain: io.bluewallet.bluewallet.receiveonchain → com.malinwallet.app.receiveonchain
  - Xpub: io.bluewallet.bluewallet.xpub → com.malinwallet.app.xpub
  - ViewInBlockExplorer: io.bluewallet.bluewallet.blockexplorer → com.malinwallet.app.blockexplorer

# Shared framework
ios/Shared/UserDefaultsGroupKey.swift
  - Mettre à jour les commentaires et références
```

### 2.2 Fastlane Configuration

```bash
fastlane/Matchfile
  - app_identifier: ["io.bluewallet.bluewallet", ...] → ["com.malinwallet.app", ...]

ios/export_options.plist
  - provisioningProfiles: io.bluewallet.bluewallet → com.malinwallet.app
```

---

## 3️⃣ REFACTORISATION TYPESCRIPT/JAVASCRIPT

### 3.1 Deeplink Schema

**File:** `class/deeplink-schema-match.ts`

```typescript
// Ancien
if (lowercaseString.startsWith('bluewallet:') || lowercaseString.startsWith('blue:')) {

// Nouveau
if (lowercaseString.startsWith('malinwallet:') || lowercaseString.startsWith('mw:')) {
```

### 3.2 Handoff Activity Types

**File:** `components/types.ts`

```typescript
export enum HandOffActivityType {
  ReceiveOnchain = 'com.malinwallet.app.receiveonchain',
  Xpub = 'com.malinwallet.app.xpub',
  ViewInBlockExplorer = 'com.malinwallet.app.blockexplorer',
}
```

### 3.3 File System Types

**File:** `blue_modules/fs.ts`

```typescript
const [res] = await pick({
  type: Platform.OS === 'ios' 
    ? ['com.malinwallet.psbt', 'com.malinwallet.psbt.txn', types.json] 
    : [types.allFiles],
});
```

### 3.4 Currency Module

**File:** `blue_modules/currency.ts`

```typescript
export const GROUP_IO_MALINWALLET = 'group.com.malinwallet.app';
```

### 3.5 LndHub Helper

**File:** `helpers/lndHub.ts`

```typescript
import { GROUP_IO_MALINWALLET } from '../blue_modules/currency';
```

---

## 4️⃣ CONFIGURATION EXTERNE

### 4.1 Firebase

**File:** `android/app/google-services.json`

```json
{
  "project_info": {
    "project_id": "malinwallet-prod",
    "firebase_url": "https://malinwallet-prod.firebaseio.com",
    "storage_bucket": "malinwallet-prod.appspot.com"
  }
}
```

**Action:** Créer un nouveau projet Firebase pour MalinWallet

### 4.2 Scripts de Build

**File:** `scripts/build-release-apk.sh`

```bash
# Ancien
echo $KEYSTORE_FILE_HEX > bluewallet-release-key.keystore.hex
xxd -plain -revert bluewallet-release-key.keystore.hex > ./android/bluewallet-release-key.keystore

# Nouveau
echo $KEYSTORE_FILE_HEX > malinwallet-release-key.keystore.hex
xxd -plain -revert malinwallet-release-key.keystore.hex > ./android/malinwallet-release-key.keystore
```

### 4.3 Tests d'Intégration

**File:** `tests/integration/ElectrumClient.test.js`

```javascript
// Mettre à jour les serveurs Electrum si nécessaire
const hardcodedPeers = [
  { host: 'electrum1.malinwallet.io', ssl: '443' },
  { host: 'electrum2.malinwallet.io', ssl: '443' },
  { host: 'electrum3.malinwallet.io', ssl: '443' },
];
```

---

## 5️⃣ SÉCURITÉ

### 5.1 Gestion des Clés Privées

✅ **Bonnes pratiques implémentées :**
- Clés stockées localement avec `react-native-keychain`
- Chiffrement AES-256 pour le stockage persistant
- Pas de transmission de clés vers les serveurs
- Utilisation de `react-native-secure-key-store` pour iOS

### 5.2 Chiffrement des Données Sensibles

```typescript
// Exemple d'implémentation
import CryptoJS from 'crypto-js';

const encryptPrivateKey = (privateKey: string, password: string): string => {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
};

const decryptPrivateKey = (encrypted: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

### 5.3 Audit des Dépendances

```bash
npm audit
npm audit fix
```

---

## 6️⃣ CI/CD GITLAB

### 6.1 Pipeline Configuration

**File:** `.gitlab-ci.yml`

```yaml
stages:
  - lint
  - test
  - build
  - deploy

lint:
  stage: lint
  script:
    - npm run lint
  only:
    - merge_requests
    - main

test:
  stage: test
  script:
    - npm run test
  coverage: '/Coverage: \d+\.\d+%/'

build:android:
  stage: build
  script:
    - cd android && ./gradlew assembleRelease
  artifacts:
    paths:
      - android/app/build/outputs/apk/release/
    expire_in: 1 week

build:ios:
  stage: build
  script:
    - cd ios && pod install
    - xcodebuild -workspace BlueWallet.xcworkspace -scheme BlueWallet -configuration Release
  artifacts:
    paths:
      - ios/build/
    expire_in: 1 week
```

### 6.2 Variables d'Environnement

```bash
# GitLab CI/CD Variables
KEYSTORE_FILE_HEX=<base64-encoded-keystore>
KEYSTORE_PASSWORD=<password>
KEY_ALIAS=<alias>
KEY_PASSWORD=<password>
APPLE_TEAM_ID=<team-id>
APPLE_DEVELOPER_ID=<developer-id>
```

---

## 7️⃣ STRUCTURE DE FICHIERS OPTIMISÉE

```
MalinWallet/
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   │   ├── crypto/
│   │   ├── blockchain/
│   │   └── security/
│   ├── utils/
│   ├── hooks/
│   ├── types/
│   └── App.tsx
├── android/
│   ├── app/
│   │   ├── src/main/java/com/malinwallet/app/
│   │   └── build.gradle
│   └── build.gradle
├── ios/
│   ├── MalinWallet/
│   └── MalinWallet.xcodeproj/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .gitlab-ci.yml
├── package.json
└── README.md
```

---

## 8️⃣ CHECKLIST DE VALIDATION

- [ ] Tous les identifiants Android mis à jour
- [ ] Tous les identifiants iOS mis à jour
- [ ] Deeplinks testés (malinwallet://, mw://)
- [ ] Handoff fonctionnel sur iOS
- [ ] Firebase reconfigurée
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Linting sans erreurs
- [ ] Build Android réussit
- [ ] Build iOS réussit
- [ ] Sécurité validée (npm audit)
- [ ] Documentation mise à jour

---

## 9️⃣ RESSOURCES

- [React Native Documentation](https://reactnative.dev/)
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [ethers.js](https://docs.ethers.org/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)

---

**Dernière mise à jour:** 2025-12-09
**Statut:** En cours de refactorisation
