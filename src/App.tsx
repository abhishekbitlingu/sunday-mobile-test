import {RootNavigator} from '@/components/navigation/Navigator';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
