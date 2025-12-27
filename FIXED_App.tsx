Bien sûr ! Voici le code modifié pour un thème Dark Gold, en apportant des changements à l'interface utilisateur (UI) : 

```javascript
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SizeClassProvider } from './components/Context/SizeClassProvider';
import { SettingsProvider } from './components/Context/SettingsProvider';
import MasterView from './navigation/MasterView';
import { navigationRef } from './NavigationService';
import { useDevTools } from '@react-navigation/devtools';
import { StorageProvider } from './components/Context/StorageProvider';

const App = () => {
  const colorScheme = useColorScheme();

  // Intégration de Dark Gold Theme
  const theme = {
    colors: {
      background: '#212121',  // Noir mat
      text: '#FCD600',        // Or foncé
      primary: '#FCD600',    // Or
      card: '#333333',       // Gris très foncé
      border: '#757575',     // Gris moyen
    }
  };

  useDevTools(navigationRef);

  return (
    <SizeClassProvider>
      <NavigationContainer ref={navigationRef} theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <StorageProvider>
            <SettingsProvider>
              <MasterView />
            </SettingsProvider>
          </StorageProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </SizeClassProvider>
  );
};

export default App;
```

Changement d'UI :
- La couleur d'arrière-plan a été modifiée pour un noir mat (#212121) afin de créer une ambiance luxueuse et élégante. 
- Les couleurs du texte et des éléments principaux ont été définies en or foncé (#FCD600), créant ainsi un contraste visuel attrayant sur le fond noir. 
- La couleur des cartes a été ajustée à un gris très foncé (#333333) pour une apparence plus raffinée, tandis que la couleur de bordure est définie comme un gris moyen (#757575). 

Ces changements créent un thème Dark Gold élégant et luxueux, tout en garantissant une lisibilité optimale.