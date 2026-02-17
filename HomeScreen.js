import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { MatchCard, SectionHeader, GreenHeader } from '../components';
import { colors, spacing, radius, typography, shadow } from '../theme';

export default function HomeScreen({ navigation }) {
  const { matches, stats, profile } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <GreenHeader style={styles.header}>
        <View style={styles.brandmark}>
          <Text style={styles.brandmarkText}>STANDSIDE</Text>
        </View>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.greeting}>{greeting()}, welcome back</Text>
          <Text style={styles.userName}>{profile.name.split(' ')[0]}'s Diary 🏐</Text>
        </Animated.View>
        <View style={styles.statsRow}>
          {[
            { val: stats.games, lbl: 'Games' },
            { val: stats.programmes, lbl: 'Programmes' },
            { val: stats.following, lbl: 'Following' },
          ].map((s, i) => (
            <View key={i} style={styles.statPill}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>
      </GreenHeader>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live banner */}
        <TouchableOpacity
          style={styles.liveBanner}
          onPress={() => navigation.navigate('Community')}
          activeOpacity={0.88}
        >
          <View style={styles.liveDot} />
          <View style={styles.liveText}>
            <Text style={styles.liveTitleText}>Standsiders at games today</Text>
            <Text style={styles.liveSubText}>143 standsiders logged games today</Text>
          </View>
          <Text style={styles.liveCount}>143</Text>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.qaBtn}
            onPress={() => navigation.navigate('LogMatch')}
            activeOpacity={0.85}
          >
            <Text style={styles.qaIcon}>➕</Text>
            <Text style={styles.qaLabel}>Log a Game</Text>
            <Text style={styles.qaSub}>Record today's match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.qaBtn}
            onPress={() => navigation.navigate('Community')}
            activeOpacity={0.85}
          >
            <Text style={styles.qaIcon}>👥</Text>
            <Text style={styles.qaLabel}>Community</Text>
            <Text style={styles.qaSub}>See what friends logged</Text>
          </TouchableOpacity>
        </View>

        {/* Recent matches */}
        <SectionHeader
          title="Recent Matches"
          action="See all"
          onAction={() => {}}
        />
        {matches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  header: { paddingTop: 56 },
  brandmark: { marginBottom: 10 },
  brandmarkText: {
    fontSize: 11, fontFamily: typography.display,
    color: 'rgba(255,255,255,0.4)', letterSpacing: 3,
  },
  greeting: { fontSize: 12, color: colors.greenLight, marginBottom: 2 },
  userName: { fontSize: 22, fontFamily: typography.display, color: colors.white, marginBottom: 16 },

  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statPill: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: radius.md, paddingVertical: 10, alignItems: 'center',
  },
  statVal: { fontSize: 20, fontFamily: typography.display, color: colors.goldLight },
  statLbl: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: 2 },

  body: { flex: 1 },
  bodyContent: { padding: spacing.lg },

  liveBanner: {
    backgroundColor: colors.green,
    borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: spacing.lg,
    ...shadow.md,
  },
  liveDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.greenLight,
  },
  liveText: { flex: 1 },
  liveTitleText: { fontSize: 12, fontWeight: '700', color: colors.white },
  liveSubText: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  liveCount: { fontSize: 22, fontFamily: typography.display, color: colors.goldLight },

  quickActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  qaBtn: {
    flex: 1, backgroundColor: colors.white,
    borderRadius: radius.md, padding: 13,
    borderWidth: 1.5, borderColor: colors.border,
    ...shadow.sm,
  },
  qaIcon: { fontSize: 20, marginBottom: 5 },
  qaLabel: { fontSize: 12, fontWeight: '600', color: colors.ink },
  qaSub: { fontSize: 10, color: colors.muted, marginTop: 1 },
});
