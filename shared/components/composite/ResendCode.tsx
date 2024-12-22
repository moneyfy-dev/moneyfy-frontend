import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '@/shared/hooks';

interface ResendCodeProps {
  onResend: () => Promise<void>;
  disabled?: boolean;
  initialTimer?: number;
}

export const ResendCode: React.FC<ResendCodeProps> = ({ 
  onResend, 
  disabled = false,
  initialTimer = 60 
}) => {
  const [isResendDisabled, setIsResendDisabled] = useState(disabled);
  const [resendTimer, setResendTimer] = useState(0);
  const themeColors = useThemeColor();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setResendTimer(initialTimer);

    try {
      await onResend();
    } catch (error) {
      // El error se maneja en el componente padre
      setIsResendDisabled(false);
      setResendTimer(0);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleResend} 
      disabled={isResendDisabled}
      style={styles.container}
    >
      <ThemedText 
        variant='paragraph' 
        textAlign='center'
        style={isResendDisabled ? styles.disabledText : {color: themeColors.textColorAccent}}
      >
        {isResendDisabled 
          ? `Reenviar código en ${resendTimer}s` 
          : 'Reenviar código'}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  disabledText: {
    opacity: 0.5,
  }
});
