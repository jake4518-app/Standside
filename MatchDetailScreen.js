import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Avatar, SportBadge, formatDate } from '../components';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { STANDSIDERS } from '../data';

export default function MatchDetailScreen({ route, navigation }) {
  const { matchId } = route.params;
  const { matches, standsiders } = useApp();
  const match = matches.find(m => m.id === matchId);

  if (!match) {
    return (
      <View style={styles.notFound}>
        <Text>Match not found.</Text>
      </View>
    );
  }

  const friendsAtGame = standsiders.filter(s => s.following).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity>
          <Text style={styles.shareBtn}>↗</Text>
        </TouchableOpacity>

        {/* Badges */}
        <View style={styles.badges}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{match.sport}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{match.competition}</Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreRow}>
          <View style={styles.teamSide}>
            <Text style={styles.teamName}>{match.homeTeam}</Text>
            <Text style={styles.scoreText}>
              {match.homeScore.goals}-{String(match.homeScore.points).padStart(2, '0')}
            </Text>
            <Text style={styles.ptsText}>
              {match.homeScore.goals * 3 + match.homeScore.points} pts
            </Text>
          </View>
          <Text style={styles.vsText}>v</Text>
          <View style={[styles.teamSide, { alignItems: 'flex-end' }]}>
            <Text style={styles.teamName}>{match.awayTeam}</Text>
            <Text style={styles.scoreText}>
              {match.awayScore.goals}-{String(match.awayScore.points).padStart(2, '0')}
            </Text>
            <Text style={styles.ptsText}>
              {match.awayScore.goals * 3 + match.awayScore.points} pts
            </Text>
          </View>
        </View>
        <Text style={styles.venueText}>📍 {match.venue} · {formatDate(match.date)}</Text>

        {/* Curve */}
        <View style={styles.headerCurve} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Standsiders at this game */}
        <Text style={[styles.sectionTitle, { marginBottom: spacing.sm }]}>
          Standsiders at this game
        </Text>
        <View style={[styles.card, styles.standsidersCard]}>
          <View style={styles.standsidersHeader}>
            <Text style={styles.standsidersTitle}>Who was there</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{match.standsidersCount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.avatarRow}>
            {friendsAtGame.map(s => (
              <View key={s.id} style={styles.avatarWrap}>
                <Avatar initials={s.initials} color={s.avatarColor} size={38} fontSize={14} />
                <Text style={styles.avatarName} numberOfLines={1}>{s.name.split(' ')[0]}</Text>
              </View>
            ))}
            <View style={styles.avatarWrap}>
              <View style={styles.moreAvatar}>
                <Text style={styles.moreAvatarText}>+{match.standsidersCount - friendsAtGame.length}</Text>
              </View>
              <Text style={styles.avatarName}>more</Text>
            </View>
          </View>
          {match.friendsCount > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Community')}>
              <Text style={styles.friendsCallout}>
                {match.friendsCount} of your friends were here ·{' '}
                <Text style={styles.friendsCalloutLink}>View all →</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Programme */}
        {match.hasProgramme && (
          <>
            <Text style={[styles.sectionTitle, { marginBottom: spacing.sm }]}>Match Programme</Text>
            <TouchableOpacity style={styles.programmeCard} activeOpacity={0.88}>
              <View style={styles.programmeThumb}>
                <Text style={{ fontSize: 24 }}>📰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.programmeMeta}>Programme attached</Text>
                <Text style={styles.programmeName}>{match.homeTeam} v {match.awayTeam}</Text>
                <Text style={styles.programmeSub}>{match.competition}</Text>
              </View>
              <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>›</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Match info */}
        <Text style={[styles.sectionTitle, { marginBottom: spacing.sm }]}>Match Info</Text>
        <View style={styles.card}>
          {[
            { label: 'Competition', value: match.competition },
            { label: 'Venue', value: match.venue },
            { label: 'Date', value: formatDate(match.date) },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoKey}>{row.label}</Text>
              <Text style={styles.infoVal}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {match.notes ? (
          <>
            <Text style={[styles.sectionTitle, { marginBottom: spacing.sm }]}>My Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notesText}>{match.notes}</Text>
            </View>
          </>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: colors.green,
    paddingTop: 56, paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 8,
    position: 'relative',
  },
  backBtn: {
    width: 32, height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: 56, left: spacing.xl,
  },
  backBtnText: { fontSize: 16, color: colors.white, fontWeight: '700' },
  shareBtn: { fontSize: 18, color: 'rgba(255,255,255,0.65)', position: 'absolute', top: 56, right: spacing.xl },

  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: 40, marginBottom: spacing.md },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3,
  },
  headerBadgeText: { fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  teamSide: { flex: 1 },
  teamName: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  scoreText: { fontSize: 32, fontFamily: typography.display, color: colors.white, lineHeight: 38 },
  ptsText: { fontSize: 11, color: colors.goldLight, marginTop: 2 },
  vsText: { fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: '600', paddingHorizontal: 8 },
  venueText: { fontSize: 11, color: colors.greenLight, textAlign: 'center' },
  headerCurve: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 24, backgroundColor: colors.cream,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },

  body: { flex: 1 },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: 15, fontFamily: typography.display, color: colors.ink },

  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },

  // Standsiders
  standsidersCard: {},
  standsidersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  standsidersTitle: { fontSize: 13, fontWeight: '700', color: colors.ink },
  countBadge: { backgroundColor: colors.green, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
  avatarRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  avatarWrap: { alignItems: 'center', gap: 4 },
  avatarName: { fontSize: 9, color: colors.muted, fontWeight: '600', maxWidth: 38, textAlign: 'center' },
  moreAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.greenPale,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  moreAvatarText: { fontSize: 10, fontWeight: '700', color: colors.green },
  friendsCallout: { fontSize: 11, color: colors.muted, textAlign: 'center' },
  friendsCalloutLink: { color: colors.green, fontWeight: '600' },

  // Programme card
  programmeCard: {
    backgroundColor: colors.green, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: spacing.md, ...shadow.sm,
  },
  programmeThumb: {
    width: 50, height: 64, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  programmeMeta: { fontSize: 10, color: colors.greenLight, marginBottom: 3 },
  programmeName: { fontSize: 14, fontWeight: '600', color: colors.white, fontFamily: typography.display },
  programmeSub: { fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  // Info rows
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoKey: { fontSize: 11, color: colors.muted },
  infoVal: { fontSize: 12, fontWeight: '500', color: colors.ink },

  notesText: { fontSize: 13, color: colors.ink, lineHeight: 20 },
});
