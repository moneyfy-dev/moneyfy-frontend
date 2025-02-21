import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Share, Clipboard, TouchableOpacity, Pressable } from 'react-native';
import { useUser } from '@/core/context';
import { ThemedListLayout, ThemedText, LoadingScreen, ThemedButton, ThemedLayout, IconContainer, ThemedInput } from '@/shared/components';
import { Referred, ReferredStatus } from '@/core/types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/shared/hooks';

export default function ReferredsScreen() {
    const { getReferreds, user } = useUser();
    const themeColors = useThemeColor();
    const [referreds, setReferreds] = useState<Referred[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        dateRange: {
            start: null as Date | null,
            end: null as Date | null
        }
    });

    useEffect(() => {
        const loadReferreds = async () => {
            setIsLoading(true);
            try {
                const response = await getReferreds();
                if (response?.data?.referreds) {
                    setReferreds(response.data.referreds);
                }
            } catch (error) {
                console.error('Error al cargar referidos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadReferreds();
    }, []);

    const getStatusColor = (status: ReferredStatus) => {
        const colors: Record<ReferredStatus, string> = {
            Activo: themeColors.status.success,
            Pausado: themeColors.status.warning,
            Eliminado: themeColors.status.error,
        };
        return colors[status];
    };

    const normalizeStatus = (status: string): ReferredStatus => {
        const statusMap: { [key: string]: ReferredStatus } = {
            'Activo': 'Activo',
            'Pausado': 'Pausado',
            'Eliminado': 'Eliminado',
        };

        return statusMap[status] || 'Iniciando';
    };

    const handleShareLink = async () => {
        try {
            await Share.share({
                title: '¡Únete a Moneyfy!',
                message: `¡Hola! Te invito a unirte a Moneyfy. Usa mi código de referido: ${user?.codeToRefer}\n\nDescarga la app aquí: https://play.google.com/store/apps/details?id=cl.moneyfy.app.&hl=es_9393`,
            });
        } catch (error) {
            console.error('Error al compartir:', error);
        }
    };

    const handleCopyCode = async () => {
        try {
            await Clipboard.setString(user?.codeToRefer || '');
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Error al copiar:', error);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const newFilters = { ...filters };
        setFilters(newFilters);
    };

    const HeaderComponent = (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <ThemedText variant="title" textAlign="center">
                    Historial de Referido
                </ThemedText>
            </View>

            <View style={styles.searchContainer}>
                <ThemedInput
                    type="search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar por nombre"
                    onIconPress={() => console.log('Buscar:', searchQuery)}
                />
            </View>

            <View style={styles.resultsContainer}>
                <ThemedText variant="paragraph">
                    {referreds.length} resultados
                </ThemedText>

                <Pressable
                    onPress={() => setShowFilters(true)}
                    style={styles.filterIcon}
                >
                    <Ionicons name="menu-outline" size={24} color={themeColors.textColorAccent} />
                </Pressable>
            </View>
        </View>
    );

    const ReferredItem = ({ item, index, isLast }: { item: Referred, index: number, isLast: boolean }) => (
        <View style={[{
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: themeColors.borderBackgroundColor
        }]}>
            <View style={styles.referredItem}>
                <View style={styles.referredItemHeader}>
                    <IconContainer
                        icon="person-outline"
                        size={24}
                        backgroundColor={themeColors.buttonBackgroundColor}
                    />
                    <View style={styles.referredItemInfo}>
                        <View style={styles.nameContainer}>

                            <ThemedText variant="subTitleBold">
                                <ThemedText variant="subTitleBold" color={themeColors.textColorAccent}>
                                    {item.name}
                                </ThemedText>
                                {' '} {item.surname}
                            </ThemedText>

                            <ThemedText variant="notes">
                                {item.email}
                            </ThemedText>
                        </View>

                        <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(normalizeStatus(item.status)) }
                            ]}>
                                <ThemedText
                                    variant="paragraph"
                                    color={themeColors.white}
                                >
                                    {item.status}
                                </ThemedText>
                            </View>

                            <ThemedText variant='paragraph'>|</ThemedText>

                            <View style={styles.totalReferredsContainer}>
                                <ThemedText variant="paragraph">
                                    Referidos de {item.name}:
                                </ThemedText>
                                <ThemedText variant="paragraphBold">
                                    {item.totalReferreds}
                                </ThemedText>
                            </View>
                        </View>
                        <ThemedText variant="paragraph">Total Ingresos: {' '}
                            <ThemedText variant="paragraphBold" color={themeColors.textColorAccent}>
                                {item.totalIncome.toLocaleString('es-ES')}
                            </ThemedText>
                        </ThemedText>
                    </View>

                </View>
            </View>
        </View>
    );

    return (
        <>
            {
                isLoading ? (
                    <LoadingScreen />
                ) : referreds.length === 0 ? (
                    <ThemedLayout padding={[0, 40]}>
                        <View style={styles.content}>
                            <ThemedText variant="superTitle" textAlign="center" marginBottom={8}>
                                Aún no tienes
                            </ThemedText>
                            <ThemedText
                                variant="superTitle"
                                textAlign="center"
                                color={themeColors.status.success}
                                marginBottom={16}
                            >
                                referidos  🙌😃
                            </ThemedText>

                            <ThemedText variant="paragraph" textAlign="center" marginBottom={24}>
                                Coparte tu código QR o link con tus amigos, familiares, quien quieras, y sigue sumando lucas.
                            </ThemedText>

                            <View style={[
                                styles.codeContainer,
                                {
                                    backgroundColor: themeColors.backgroundCardColor,
                                    borderColor: themeColors.textColorAccent,
                                }
                            ]}>
                                <ThemedText
                                    variant="superTitle"
                                    textAlign="center"
                                    color={themeColors.textColorAccent}
                                    style={styles.codeText}
                                >
                                    {user?.codeToRefer}
                                </ThemedText>
                            </View>

                            <TouchableOpacity onPress={handleCopyCode}>
                                <View style={styles.copyContainer}>
                                    <ThemedText
                                        variant="paragraph"
                                        color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
                                    >
                                        {isCopied ? "¡Código copiado!" : "Copiar código"}
                                    </ThemedText>
                                    <Ionicons
                                        name={isCopied ? "checkmark-circle" : "copy-outline"}
                                        size={20}
                                        color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
                                        style={{ marginLeft: 8 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ThemedButton
                            text="Compartir"
                            onPress={handleShareLink}
                            icon={{ name: "share", position: "left" }}
                        />
                    </ThemedLayout>
                ) : (
                    <ThemedListLayout
                        padding={[0, 24]}
                        headerComponent={HeaderComponent}
                    >
                        <FlatList
                            data={referreds}
                            renderItem={({ item, index }) => <ReferredItem item={item} index={index} isLast={index === referreds.length - 1} />}
                            keyExtractor={(item) => item.email}
                            style={[styles.list, { borderTopColor: themeColors.borderBackgroundColor }]}
                            contentContainerStyle={styles.listContent}
                        />
                    </ThemedListLayout>
                )
            }
        </>);
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    codeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 2,
        width: '100%',
    },
    codeText: {
        fontSize: 32,
        lineHeight: 32,
        letterSpacing: 2,
    },
    copyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    headerContainer: {
        paddingHorizontal: 24,
    },
    header: {
        paddingVertical: 24,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterIcon: {
        padding: 12,
    },
    list: {
        flex: 1,
        borderTopWidth: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
    referredItem: {
        paddingVertical: 16,
    },
    referredItemHeader: {
        flexDirection: 'row',
        gap: 10,
    },
    referredItemInfo: {
        flex: 1,
    },
    nameContainer: {
        maxWidth: '99%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 3,
    },
    totalReferredsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
