import React, { useState, useCallback, useEffect } from 'react';
import { MessageContext, MessageConfig } from './MessageContext';
import { MessageModal } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { setMessageHandler } from '@/core/services/api/interceptors';

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
  const [endpointConfigs] = useState<Map<string, MessageConfig>>(new Map());

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
    setMessageState(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const configureEndpoint = useCallback((endpoint: string, config: MessageConfig) => {
    console.log('⚙️ Configurando endpoint:', endpoint, config);
    endpointConfigs.set(endpoint, config);
  }, [endpointConfigs]);

  const getEndpointConfig = useCallback((endpoint: string) => {
    const config = endpointConfigs.get(endpoint);
    console.log('🔍 Obteniendo configuración para:', endpoint, config);
    return config;
  }, [endpointConfigs]);

  useEffect(() => {
    console.log('🔄 Configurando message handler');
    setMessageHandler({
      showError,
      showSuccess,
      getEndpointConfig
    });
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
      />
    </MessageContext.Provider>
  );
}; 