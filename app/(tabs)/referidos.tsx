import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedListLayout } from '@/components/ThemedListLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { FiltersModal } from '@/components/FiltersModal';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemedDatePicker } from '@/components/ThemedDatePicker';
import { mockReferrals } from '@/mocks/referrals';
import { Referral } from '@/types/referral';

type ReferralStatus = 'cotizando' | 'inspeccion' | 'aprobado';

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
    };
    return colors[status];
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Aquí implementaremos la lógica de búsqueda en tiempo real
  };

  const handleLoadMore = () => {
    // Implementar lógica de scroll infinito
  };

  const ReferralItem = ({ item }: { item: Referral }) => (
    <Pressable
      onPress={() => router.push({
        pathname: '/(referrals)/referral-detail',
        params: { id: item.referredId }
      })}
      style={styles.referralItem}
    >
      <View style={styles.referralHeader}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={24} color={themeColors.textColorAccent} />
        </View>
        <View style={styles.referralInfo}>
          <View style={styles.nameContainer}>
            <ThemedText variant="subTitle">
              {item.referredPersonalData.name} {item.referredPersonalData.surname}
            </ThemedText>
            <ThemedText variant="paragraph">
              {format(new Date(item.updatedDate), 'dd/MM/yyyy')}
            </ThemedText>
          </View>
          <View style={styles.statusContainer}>
            <ThemedText
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.referredStatus as ReferralStatus) }
              ]}
            >
              {item.referredStatus}
            </ThemedText>
            <ThemedText>{item.referredCarData.ppu}</ThemedText>
          </View>
        </View>
      </View>
      <ThemedText variant="paragraph">
        Cotizado el {format(new Date(item.createdDate), 'dd/MM/yyyy')}
      </ThemedText>
    </Pressable>
  );

  const HeaderComponent = (
    <>
      <View style={styles.header}>
        <ThemedText variant="title" textAlign="center">
          Historial de referidos
        </ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <ThemedInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Buscar por nombre"
          icon="search-outline"
          style={styles.searchInput}
        />
        <Pressable 
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
        >
          <Ionicons 
            name="filter-outline" 
            size={24} 
            color={themeColors.textColorAccent} 
          />
        </Pressable>
      </View>

      <View style={styles.resultsContainer}>
        <ThemedText variant="paragraph">
          {referrals.length} resultados
        </ThemedText>
      </View>
    </>
  );

  return (
    <ThemedListLayout 
      padding={[0, 24]}
      headerComponent={HeaderComponent}
    >
      <FlatList
        data={referrals}
        renderItem={({ item }) => <ReferralItem item={item} />}
        keyExtractor={(item) => item.referredId}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <View style={styles.filterSection}>
          {/* Filtro de Estado */}
          <View>
            <ThemedText variant="subTitle">Estado</ThemedText>
            <View style={styles.statusOptions}>
              {['cotizando', 'inspeccion', 'aprobado'].map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusOption,
                    filters.status === status && {
                      backgroundColor: themeColors.textColorAccent,
                    },
                  ]}
                  onPress={() => setFilters({ ...filters, status })}
                >
                  <ThemedText
                    style={{
                      color: filters.status === status ? themeColors.white : themeColors.textColor,
                    }}
                  >
                    {status}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Filtro de Rango de Fechas */}
          <View>
            <ThemedText variant="subTitle">Rango de fechas</ThemedText>
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
        </View>
      </FiltersModal>
    </ThemedListLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterButton: {
    padding: 8,
  },
  resultsContainer: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
    paddingBottom: 16,
  },
  referralItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  referralHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  filterSection: {
    gap: 24,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});