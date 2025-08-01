import { useSelector, useDispatch } from 'react-redux';
import { 
  selectTheme, 
  selectSidebarOpen, 
  selectLoading, 
  selectNotifications,
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications
} from '../features/ui/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const loading = useSelector(selectLoading);
  const notifications = useSelector(selectNotifications);

  const showNotification = (notification) => {
    dispatch(addNotification(notification));
    
    // Auto-remove after 5 seconds
    if (notification.type !== 'error') {
      setTimeout(() => {
        dispatch(removeNotification(notification.id || Date.now()));
      }, 5000);
    }
  };

  const showSuccess = (message) => {
    showNotification({ type: 'success', message });
  };

  const showError = (message) => {
    showNotification({ type: 'error', message });
  };

  const showInfo = (message) => {
    showNotification({ type: 'info', message });
  };

  const showWarning = (message) => {
    showNotification({ type: 'warning', message });
  };

  return {
    theme,
    sidebarOpen,
    loading,
    notifications,
    toggleTheme: () => dispatch(toggleTheme()),
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarOpen: (open) => dispatch(setSidebarOpen(open)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification: (id) => dispatch(removeNotification(id)),
    clearNotifications: () => dispatch(clearNotifications()),
  };
};
