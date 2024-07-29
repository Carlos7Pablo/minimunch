import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navegador from './src/componentes/Navegador'

export default function App() {
  return (
      <NavigationContainer>
        <Navegador/>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
