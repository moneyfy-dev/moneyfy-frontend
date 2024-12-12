import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList, Modal, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '@/types/useAccounts';
import { useRouter } from 'expo-router';
import { deleteAccount } from '@/services/accountService';
import { MessageModal } from './MessageModal';

interface AccountListScreenProps {
    accounts: Account[];
    onSelectAccount: (accountId: string) => void;
    onAccountUpdated: () => void;
}

export function AccountListScreen({ accounts, onSelectAccount, onAccountUpdated }: AccountListScreenProps) {
    const themeColors = useThemeColor();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const handleMenuPress = (account: Account) => {
        setSelectedAccount(account);
        setMenuVisible(true);
    };

    const handleDeleteAccount = async () => {
        if (selectedAccount) {
            try {
                console.log('selectedAccount', selectedAccount);
                console.log('selectedId', selectedAccount.accountId);
                await deleteAccount(selectedAccount.accountId);
                setSuccessMessage('Cuenta eliminada correctamente');
                setSuccessModalVisible(true);
                onAccountUpdated();
            } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                setErrorMessage('No se pudo eliminar la cuenta');
                setIsErrorModalVisible(true);
            }
        }
        setMenuVisible(false);
    };

    const handleEditAccount = () => {
        if (selectedAccount) {
            router.push({
                pathname: '/add-account',
                params: { accountId: selectedAccount.accountId }
            });
        }
        setMenuVisible(false);
    };

    const renderAccount = ({ item }: { item: Account }) => (
        <TouchableOpacity 
            style={[styles.accountItem, { borderColor: themeColors.borderBackgroundColor }]}
            onPress={() => onSelectAccount(item.accountId)}
        >
            <View style={styles.accountInfo}>
                <View style={[styles.radioButton, { borderColor: Colors.common.gray4 }, item.selected && { borderColor: themeColors.textColorAccent }]}>
                    {item.selected && <View style={[styles.radioButtonInner, { backgroundColor: themeColors.textColorAccent }]} />}
                </View>
                <View>
                    <ThemedText variant="subTitleBold">{item.alias}</ThemedText>
                    <ThemedText variant="paragraph">{item.bank} - {item.accountNumber}</ThemedText>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleMenuPress(item)}>
                <Ionicons name="ellipsis-vertical" size={20} color={themeColors.gray1Gray04} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <>
            <FlatList
                data={accounts}
                renderItem={renderAccount}
                keyExtractor={(item) => item.accountId}
                style={styles.list}
            />
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={[styles.menuPanel, { backgroundColor: themeColors.backgroundColor }]}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleEditAccount}>
                            <Ionicons name="create-outline" size={24} color={themeColors.textColor} />
                            <ThemedText style={styles.menuItemText}>Editar</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            Alert.alert(
                                "Confirmar eliminación",
                                "¿Estás seguro de que quieres eliminar esta cuenta?",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    { text: "Confirmar", onPress: handleDeleteAccount }
                                ]
                            );
                        }}>
                            <Ionicons name="trash-outline" size={24} color={themeColors.status.error} />
                            <ThemedText style={[styles.menuItemText, { color: themeColors.status.error }]}>Eliminar</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <MessageModal
                isVisible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                title="Éxito"
                message={successMessage}
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setSuccessModalVisible(false)
                }}
            />

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error"
                message={errorMessage}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorModalVisible(false)
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    accountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bankName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accountNumber: {
        fontSize: 14,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuPanel: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    menuItemText: {
        marginLeft: 10,
        fontSize: 16,
    },
});
