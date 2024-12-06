import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedListLayout } from '@/components/ThemedListLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { FiltersModal } from '@/components/FiltersModal';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconContainer } from '@/components/IconContainer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemedDatePicker } from '@/components/ThemedDatePicker';
import { ThemedButton } from '@/components/ThemedButton';
import { mockReferrals } from '@/mocks/referrals';
import { Referral } from '@/types/referral';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ReferralStatus } from '@/types/referral';
import { ThemedCheckGroup } from '@/components/ThemedCheckGroup';

export default function ReferidosScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    }
  });

  const getStatusColor = (status: ReferralStatus) => {
    const colors: Record<ReferralStatus, string> = {
      cotizando: themeColors.status.warning,
      inspeccion: themeColors.status.info,
      aprobado: themeColors.status.success,
      rechazado: themeColors.status.error,
    };
    return colors[status];
  };

  const getTextColor = (status: ReferralStatus) => {
    return status === 'cotizando' ? Colors.common.black : Colors.common.white;
  };

  const filterReferrals = useCallback(() => {
    let filteredResults = [...mockReferrals];

    // Filtrar por búsqueda
    if (searchQuery) {
      filteredResults = filteredResults.filter(referral => {
        const fullName = `${referral.referredPersonalData.name} ${referral.referredPersonalData.surname}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
    }

    // Filtrar por estado
    if (filters.status) {
      filteredResults = filteredResults.filter(referral => 
        referral.referredStatus === filters.status
      );
    }

    // Filtrar por rango de fechas
    if (filters.dateRange.start || filters.dateRange.end) {
      filteredResults = filteredResults.filter(referral => {
        const referralDate = new Date(referral.createdDate);
        
        if (filters.dateRange.start && filters.dateRange.end) {
          return referralDate >= filters.dateRange.start && 
                 referralDate <= filters.dateRange.end;
        }
        
        if (filters.dateRange.start) {
          return referralDate >= filters.dateRange.start;
        }
        
        if (filters.dateRange.end) {
          return referralDate <= filters.dateRange.end;
        }

        return true;
      });
    }

    setReferrals(filteredResults);
  }, [searchQuery, filters]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const newFilters = { ...filters };
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    // Implementar lógica de scroll infinito
  };

  const applyFilters = () => {
    filterReferrals();
    setShowFilters(false);
  };

  useEffect(() => {
    filterReferrals();
  }, [searchQuery]);

  const resetFilters = () => {
    setFilters({
      status: '',
      dateRange: {
        start: null,
        end: null
      }
    });
    setReferrals(mockReferrals);
  };

  const ReferralItem = ({ item, index, isLast }: { item: Referral, index: number, isLast: boolean }) => (
    <View style={[{
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: themeColors.borderBackgroundColor
    }]}>
      <Pressable
        onPress={() => router.push({
          pathname: '/(referrals)/referral-detail',
          params: { id: item.referredId }
        })}
        style={styles.referralContent}
      >
        <View style={styles.referralHeader}>

          <IconContainer
            icon="person-outline"
            size={24}
          />
          <View style={styles.referralInfo}>
            
            <View style={styles.nameContainer}>
              <ThemedText variant="subTitleBold">
                {item.referredPersonalData.name} {item.referredPersonalData.surname}
              </ThemedText>

              <ThemedText variant="notes">
                Actualización: {format(new Date(item.updatedDate), 'dd/MM/yyyy')}
              </ThemedText>
            </View>

            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.referredStatus as ReferralStatus) }
              ]}>
                <ThemedText
                  variant="paragraph"
                  style={{ color: getTextColor(item.referredStatus as ReferralStatus) }}
                >
                  {item.referredStatus}
                </ThemedText>
              </View>

              <ThemedText variant='paragraph'>
                |
              </ThemedText>
              <View style={styles.carInfo}>
                <ThemedText variant="paragraphBold">
                  Vehiculo:
                </ThemedText>
                <ThemedText variant="paragraph">
                  {item.referredCarData.ppu}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="notes">
              Cotizado el: {format(new Date(item.createdDate), 'dd/MM/yyyy')}
            </ThemedText>

          </View>
        </View>
      </Pressable>
    </View>
  );

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
          {referrals.length} resultados
        </ThemedText>

        <Pressable
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="menu-outline" size={24} color={themeColors.textColorAccent} />
        </Pressable>
      </View>
    </View>
  );

  const statusOptions = [
    { key: 'cotizando', label: 'COTIZANDO' },
    { key: 'inspeccion', label: 'INSPECCIÓN' },
    { key: 'aprobado', label: 'APROBADO' },
    { key: 'rechazado', label: 'RECHAZADO' }
  ];

  return (
    <ThemedListLayout
      padding={[0, 24]}
      headerComponent={HeaderComponent}
    >
      <FlatList
        data={referrals}
        renderItem={({ item, index }) => (<ReferralItem item={item} index={index} isLast={index === referrals.length - 1} />)}
        keyExtractor={(item) => item.referredId}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        style={[styles.list, { borderTopColor: themeColors.borderBackgroundColor}]}
        contentContainerStyle={styles.listContent}
      />

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <View style={{ gap: 24 }}>
          {/* Filtro de Estado */}
          <View style={[styles.statusFilterContainer, { borderBottomColor: themeColors.borderBackgroundColor }]}>
            <ThemedText variant="subTitle" marginBottom={10}>Estado</ThemedText>
            
            <ThemedCheckGroup
              options={statusOptions}
              selectedValue={filters.status}
              onSelect={(status) => setFilters({ ...filters, status })}
              containerStyle={styles.statusOptions}
            />
          </View>

          {/* Filtro de Rango de Fechas */}
          <View style={[styles.dateRangeContainer, {borderBottomColor: themeColors.borderBackgroundColor}]}>
            <ThemedText variant="subTitle" marginBottom={10}>Rango de fechas</ThemedText>

            <ThemedDatePicker
              label="Desde"
              value={filters.dateRange.start}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: date },
                })
              }
            />

            <ThemedDatePicker
              label="Hasta"
              value={filters.dateRange.end}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: date },
                })
              }
            />
          </View>

          <View style={styles.filterButtons}>
            <ThemedButton
              text="Limpiar Filtros"
              onPress={resetFilters}
              variant="secondary"
              style={styles.resetButton}
            />
            <ThemedButton
              text="Aplicar Filtros"
              onPress={applyFilters}
              style={styles.applyButton}
            />
          </View>
        </View>

      </FiltersModal>
    </ThemedListLayout>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
  list: {
    flex: 1,
    borderTopWidth: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  referralItem: {
    borderBottomWidth: 1,
  },
  referralContent: {
    paddingVertical: 16,
  },
  referralHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  referralInfo: {
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
  statusFilterContainer: {
    borderBottomWidth: 1,
    paddingBottom: 30,
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
  },
  statusText: {
    color: Colors.common.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  carInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  dateRangeContainer: {
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});