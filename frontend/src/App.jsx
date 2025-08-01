import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persistor } from './store';
import { router } from './router';
import { ToastContainer } from './components/ui';
import Loading from './components/ui/Loading';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<Loading text="Cargando aplicación..." />} 
        persistor={persistor}
      >
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
