import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, FlatList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { GreenHeader } from '../components';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { PROGRAMME_COLOURS } from '../data';

const FILTERS = ['All', 'Hurling', 'Football', '2026', '2025'];

export default function ProgrammesScreen({ navigation }) {
  const { matches } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const withProgrammes = matches.filter(m => m.hasProgramme);

  const filtered = withProgrammes.filter(m => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Hurling') return m.sport === 'Hurling';
    if (activeFilter === 'Football') return m.sport === 'Gaelic Football';
    return m.date.startsWith(activeFilter);
  });

  const getColours = (index) => PROGRAMME_COLOURS[index % PROGRAMME_COLOURS.length];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <GreenHeader style={styles.header}>
        <Text style={styles.brandmark}>STANDSIDE</Text>
        <Text style={styles.title}>My Programmes</Text>
        <Text style={styles.subtitle}>{withProgrammes.length} programmes in your collection</Text>
      </GreenHeader>

      {/* Filters */}
      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No programmes yet</Text>
            <Text style={styles.emptyText}>
              When you log a match and add a programme, it'll appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.gridInner}>
            {filtered.map((match, i) => {
              const [c1, c2] = getColours(i);
              return (
                <TouchableOpacity
                  key={match.id}
                  style={[styles.card, shadow.sm]}
                  onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.cardCover, { backgroundColor: c1 }]}>
                    {/* Gradient effect via overlay */}
                    <View style={[styles.cardCoverOverlay, { backgroundColor: c2 }]} />
                    <Text style={styles.cardCoverIcon}>📰</Text>
                    <View style={[
                      styles.typeDot,
                      { backgroundColor: match.sport === 'Hurling' ? colors.goldLight : colors.greenLight }
                    ]} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardMatch} numberOfLines={2}>
                      {match.homeTeam} v {match.awayTeam}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {match.sport === 'Hurling' ? '⚾' : '🏈'} {match.sport} · {match.date.slice(0, 4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  header: { paddingTop: 56 },
  brandmark: { fontSize: 11, fontFamily: typography.display, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginBottom: 8 },
  title: { fontSize: 22, fontFamily: typography.display, color: colors.white, marginBottom: 3 },
  subtitle: { fontSize: 12, color: colors.greenLight },

  filtersWrap: { backgroundColor: colors.cream, paddingVertical: spacing.sm },
  filters: { paddingHorizontal: spacing.lg, gap: spacing.sm, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.full, backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.green, borderColor: colors.green },
  filterChipText: { fontSize: 12, fontWeight: '500', color: colors.muted },
  filterChipTextActive: { color: colors.white, fontWeight: '600' },

  body: { flex: 1 },
  grid: { padding: spacing.lg },
  gridInner: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.md, justifyContent: 'space-between',
  },

  card: {
    width: '47.5%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  cardCover: {
    height: 110,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  cardCoverOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '50%', opacity: 0.5,
  },
  cardCoverIcon: { fontSize: 34 },
  typeDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
  },
  cardInfo: { padding: spacing.md },
  cardMatch: { fontSize: 11, fontWeight: '600', color: colors.ink, lineHeight: 15 },
  cardMeta: { fontSize: 10, color: colors.muted, marginTop: 3 },

  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: 17, fontFamily: typography.display, color: colors.ink, marginBottom: spacing.sm },
  emptyText: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
