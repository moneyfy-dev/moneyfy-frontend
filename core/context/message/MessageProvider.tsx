import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MessageContext } from './MessageContext';
import { MessageModal } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { setMessageHandler } from '@/core/services/api/interceptors';
import { MessageConfig } from '@/core/config/messages';

interface MessageState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | null;
}

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeColors = useThemeColor();
  const [messageState, setMessageState] = useState<MessageState>({
    isVisible: false,
    message: '',
    type: null,
  });
  
  const endpointConfigsRef = useRef<Map<string, MessageConfig>>(new Map());

  const showError = useCallback((message: string) => {
    console.log('🔴 Mostrando error:', message);
    setMessageState({
      isVisible: true,
      message,
      type: 'error',
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    console.log('✅ Mostrando éxito:', message);
    setMessageState({
      isVisible: true,
      message,
      type: 'success',
    });
  }, []);

  const clearMessage = useCallback(() => {
    console.log('🧹 Limpiando mensaje');
    setMessageState(prev => ({
      ...prev,
      isVisible: false,
      message: '',
    }));
  }, []);

  const configureEndpoint = useCallback((endpoint: string, config: MessageConfig) => {
    console.log('⚙️ Configurando endpoint:', endpoint, config);
    endpointConfigsRef.current.set(endpoint, config);
  }, []);

  const getEndpointConfig = useCallback((endpoint: string) => {
    const config = endpointConfigsRef.current.get(endpoint);
    console.log('🔍 Obteniendo configuración para:', endpoint, config);
    return config;
  }, []);

  useEffect(() => {
    console.log('🔄 Configurando message handler');
    setMessageHandler({
      showError,
      showSuccess,
      getEndpointConfig
    });

    return () => {
      setMessageHandler(null);
    };
  }, [showError, showSuccess, getEndpointConfig]);

  return (
    <MessageContext.Provider
      value={{
        showError,
        showSuccess,
        configureEndpoint,
        getEndpointConfig,
        clearMessage,
      }}
    >
      {children}
      <MessageModal
        isVisible={messageState.isVisible}
        onClose={clearMessage}
        title={messageState.type === 'error' ? 'Error' : 'Éxito'}
        message={messageState.message}
        icon={{
          name: messageState.type === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline',
          color: messageState.type === 'error' ? themeColors.status.error : themeColors.status.success,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: clearMessage,
        }}
        modalStyle={{
          zIndex: 9999,
          elevation: 9999,
        }}
      />
    </MessageContext.Provider>
  );
}; 