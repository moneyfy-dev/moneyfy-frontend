import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedInput } from '../ui/ThemedInput';

interface VerificationCodeProps {
  onCodeComplete: (code: string) => void;
  disabled?: boolean;
}

export const VerificationCode: React.FC<VerificationCodeProps> = ({ 
  onCodeComplete,
  disabled = false 
}) => {
  const themeColors = useThemeColor();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<React.RefObject<TextInput | null>>>([
    React.createRef(), React.createRef(), React.createRef(), 
    React.createRef(), React.createRef(), React.createRef()
  ]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        inputRefs.current.forEach(ref => ref.current?.blur());
    });

    return () => {
        keyboardDidHideListener.remove();
    };
}, []);

  const applyCodeChange = (nextCode: string[]) => {
    setCode(nextCode);
    onCodeComplete(nextCode.join(''));
  };

  const handleCodeChange = (text: string, index: number) => {
    const sanitizedText = text.replace(/\D/g, '');

    if (sanitizedText.length === 0) {
      const newCode = [...code];
      newCode[index] = '';
      applyCodeChange(newCode);
      return;
    }

    if (sanitizedText.length === 1) {
      const newCode = [...code];
      newCode[index] = sanitizedText;
      applyCodeChange(newCode);

      if (index < 5) {
        inputRefs.current[index + 1].current?.focus();
      } else {
        inputRefs.current[index].current?.blur();
      }

      return;
    }

    const newCode = [...code];
    const pastedDigits = sanitizedText.slice(0, 6 - index).split('');

    pastedDigits.forEach((digit, digitIndex) => {
      newCode[index + digitIndex] = digit;
    });

    applyCodeChange(newCode);

    const nextIndex = Math.min(index + pastedDigits.length, 5);
    const hasRemainingSlots = index + pastedDigits.length < 6;

    if (hasRemainingSlots) {
      inputRefs.current[nextIndex].current?.focus();
    } else {
      inputRefs.current[nextIndex].current?.blur();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
      const newCode = [...code];
      newCode[index - 1] = '';
      applyCodeChange(newCode);
      inputRefs.current[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.codeContainer}>
      {code.map((digit, index) => (
        <ThemedInput
          key={index}
          ref={inputRefs.current[index]}
          value={digit}
          onChangeText={(text) => handleCodeChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          autoComplete="one-time-code"
          placeholder=""
          style={[styles.codeInput, { color: themeColors.textColorAccent }]}
          textContentType="oneTimeCode"
          editable={!disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 'auto',
  },
  codeInput: {
    textAlign: 'center',
    width: 10,
    padding: 0,
  },
});
