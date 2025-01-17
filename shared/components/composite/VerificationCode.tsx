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
  const inputRefs = useRef<Array<React.RefObject<TextInput>>>([
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

  const handleCodeChange = (text: string, index: number) => {
    if (text.length <= 1 && /^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].current?.focus();
      }

      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        onCodeComplete(fullCode);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
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
          maxLength={1}
          placeholder=""
          style={[styles.codeInput, { color: themeColors.textColorAccent }]}
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
