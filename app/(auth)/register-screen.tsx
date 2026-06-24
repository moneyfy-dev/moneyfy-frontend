import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/core/context';
import { RegisterRequest, ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
  LoadingScreen,
  MessageModal,
  ThemedButton,
  ThemedInput,
  ThemedLayout,
  ThemedText,
} from '@/shared/components';
import {
  getPasswordErrors,
  sanitizeName,
  validateEmail,
  validateName,
  validatePassword,
} from '@/shared/utils/validations';

type TouchedFields = {
  nombre: boolean;
  apellido: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const themeColors = useThemeColor();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState('');

  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    nombre: false,
    apellido: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useMessageConfig(['/auth/register']);

  useEffect(() => {
    const isValid =
      validateName(nombre) &&
      validateName(apellido) &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword &&
      termsAccepted;

    setIsFormValid(isValid);
  }, [nombre, apellido, email, password, confirmPassword, termsAccepted]);

  const handleNombreChange = (text: string) => {
    setNombre(text);
    setNombreError('');
  };

  const handleApellidoChange = (text: string) => {
    setApellido(text);
    setApellidoError('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
  };

  const validateField = (field: keyof TouchedFields) => {
    if (!touchedFields[field]) return;

    switch (field) {
      case 'nombre':
      case 'apellido': {
        const sanitizedName = sanitizeName(field === 'nombre' ? nombre : apellido);
        if (!validateName(sanitizedName)) {
          const errorMessage =
            sanitizedName.length < 2
              ? `El ${field} debe tener al menos 2 letras`
              : `El ${field} solo puede contener letras y espacios`;

          if (field === 'nombre') {
            setNombreError(errorMessage);
          } else {
            setApellidoError(errorMessage);
          }
        } else if (field === 'nombre') {
          setNombreError('');
        } else {
          setApellidoError('');
        }
        break;
      }

      case 'email':
        setEmailError(validateEmail(email) ? '' : 'Formato de email invalido');
        break;

      case 'password':
        if (!validatePassword(password)) {
          const errors = getPasswordErrors(password);
          setPasswordError(`La contrasena debe contener ${errors.join(', ')}`);
        } else {
          setPasswordError('');
        }
        break;

      case 'confirmPassword':
        setConfirmPasswordError(password !== confirmPassword ? 'Las contrasenas no coinciden' : '');
        break;
    }
  };

  const handleRegister = async () => {
    const nextTouchedFields: TouchedFields = {
      nombre: true,
      apellido: true,
      email: true,
      password: true,
      confirmPassword: true,
    };

    setTouchedFields(nextTouchedFields);

    const sanitizedNombre = sanitizeName(nombre);
    const sanitizedApellido = sanitizeName(apellido);

    if (!validateName(sanitizedNombre)) {
      setNombreError(
        sanitizedNombre.length < 2
          ? 'El nombre debe tener al menos 2 letras'
          : 'El nombre solo puede contener letras y espacios',
      );
    }

    if (!validateName(sanitizedApellido)) {
      setApellidoError(
        sanitizedApellido.length < 2
          ? 'El apellido debe tener al menos 2 letras'
          : 'El apellido solo puede contener letras y espacios',
      );
    }

    if (!validateEmail(email)) {
      setEmailError('Formato de email invalido');
    }

    if (!validatePassword(password)) {
      const errors = getPasswordErrors(password);
      setPasswordError(`La contrasena debe contener ${errors.join(', ')}`);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contrasenas no coinciden');
    }

    if (
      !validateName(sanitizedNombre) ||
      !validateName(sanitizedApellido) ||
      !validateEmail(email) ||
      !validatePassword(password) ||
      password !== confirmPassword ||
      !termsAccepted
    ) {
      return;
    }

    try {
      const formData: RegisterRequest = {
        name: sanitizedNombre,
        surname: sanitizedApellido,
        email: email.trim(),
        pwd: password,
        codeToRefer: referralCode.trim() || undefined,
      };

      const response = await register(formData);

      if (response.status === 200 || response.status === 201) {
        router.push({
          pathname: ROUTES.AUTH.CONFIRMATION,
          params: {
            email,
            flow: 'registerUser',
          },
        });
      }
    } catch (error: any) {
      if (!error?.isAxiosError) {
        setUnexpectedError(
          error?.message || 'No fue posible completar el registro. Intenta nuevamente.',
        );
      }
    }
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ThemedLayout>
        <View style={styles.content}>
          <ThemedText variant="title" marginBottom={4}>
            Registrarse
          </ThemedText>
          <ThemedText variant="paragraph" marginBottom={24}>
            Crea una cuenta y comienza a vender ahora
          </ThemedText>

          <ThemedInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={handleNombreChange}
            onBlur={() => {
              setTouchedFields((prev) => ({ ...prev, nombre: true }));
              validateField('nombre');
            }}
            error={nombreError}
          />

          <ThemedInput
            placeholder="Apellido"
            value={apellido}
            onChangeText={handleApellidoChange}
            onBlur={() => {
              setTouchedFields((prev) => ({ ...prev, apellido: true }));
              validateField('apellido');
            }}
            error={apellidoError}
          />

          <ThemedInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            onBlur={() => {
              setTouchedFields((prev) => ({ ...prev, email: true }));
              validateField('email');
            }}
            error={emailError}
          />

          <ThemedInput
            placeholder="Crear contrasena"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            onBlur={() => {
              setTouchedFields((prev) => ({ ...prev, password: true }));
              validateField('password');
            }}
            error={passwordError}
          />

          <ThemedInput
            placeholder="Confirmar contrasena"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            onBlur={() => {
              setTouchedFields((prev) => ({ ...prev, confirmPassword: true }));
              validateField('confirmPassword');
            }}
            error={confirmPasswordError}
          />

          <View style={styles.referralContainer}>
            <ThemedInput
              label="Tienes un codigo de referido?"
              placeholder="Ingresa el codigo aqui"
              value={referralCode}
              onChangeText={setReferralCode}
            />
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.termsCheckbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <Ionicons
                name={termsAccepted ? 'checkbox-outline' : 'square-outline'}
                size={24}
                color={themeColors.textColorAccent}
              />
            </TouchableOpacity>

            <ThemedText variant="paragraph" style={styles.termsText}>
              He leido y estoy de acuerdo con los{' '}
              <ThemedText
                variant="textLink"
                style={styles.linkText}
                linkConfig={{ route: ROUTES.LEGAL.TERMS }}
              >
                Terminos y condiciones
              </ThemedText>
              {' '}y la{' '}
              <ThemedText
                variant="textLink"
                style={styles.linkText}
                linkConfig={{ route: ROUTES.LEGAL.PRIVACY_POLICY }}
              >
                Politica de privacidad
              </ThemedText>
              .
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            text="Crear cuenta"
            onPress={handleRegister}
            disabled={!isFormValid}
          />

          <View style={styles.loginContainer}>
            <ThemedText variant="paragraph">Ya tienes cuenta? </ThemedText>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <ThemedText variant="textLink">Inicia sesion ahora</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedLayout>

      <MessageModal
        isVisible={!!unexpectedError}
        onClose={() => setUnexpectedError('')}
        title="No se pudo crear la cuenta"
        message={unexpectedError}
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.error,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: () => setUnexpectedError(''),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsCheckbox: {
    height: 48,
    width: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  referralContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  referralText: {
    marginBottom: 8,
  },
  linkText: {
    minHeight: 48,
    paddingTop: 4,
    textAlignVertical: 'center',
  },
});
