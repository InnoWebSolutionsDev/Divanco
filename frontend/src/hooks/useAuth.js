import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectAuth, 
  selectUser, 
  selectIsAuthenticated, 
  selectIsLoading,
  logout as logoutAction
} from '../features/auth/authSlice';
import { useLogoutUserMutation } from '../features/auth/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      // 1. Llamar al API para logout en el servidor (opcional)
      try {
        await logoutUser().unwrap();
        console.log('✅ Logout del servidor exitoso');
      } catch (apiError) {
        console.warn('⚠️ Error en logout del servidor, continuando con logout local:', apiError);
      }
      
      // 2. Hacer logout local (limpiar Redux y localStorage)
      dispatch(logoutAction());
      
      // 3. Redirigir al login
      navigate('/login');
      console.log('✅ Redirigido al login');
      
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // En caso de error, hacer logout local de todas formas
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return {
    ...auth,
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isUser,
    logout: handleLogout,
  };
};