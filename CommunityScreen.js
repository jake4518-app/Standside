import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Avatar, SectionHeader, GreenHeader } from '../components';
import { colors, spacing, radius, typography, shadow } from '../theme';

export default function CommunityScreen({ navigation }) {
  const { standsiders, toggleFollow } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const following = standsiders.filter(s => s.following);
  const suggested = standsiders.filter(s => !s.following);
  const activityFeed = following.filter(s => s.recentActivity);

  const filtered = searchQuery
    ? standsiders.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.county.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <GreenHeader style={styles.header}>
        <Text style={styles.brandmark}>STANDSIDE</Text>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Follow standsiders · See who was there</Text>
      </GreenHeader>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 15 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Find a standsider..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 14, color: colors.muted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search results */}
        {filtered && (
          <>
            <SectionHeader title={`Results (${filtered.length})`} />
            {filtered.length === 0 ? (
              <Text style={styles.emptyText}>No standsiders found.</Text>
            ) : (
              filtered.map(s => (
                <StandsiderCard key={s.id} standsider={s} onToggle={() => toggleFollow(s.id)} />
              ))
            )}
          </>
        )}

        {!filtered && (
          <>
            {/* Activity feed */}
            {activityFeed.length > 0 && (
              <>
                <SectionHeader title="Friend Activity" action="See all" onAction={() => {}} />
                {activityFeed.map(s => (
                  <ActivityItem key={s.id} standsider={s} />
                ))}
              </>
            )}

            {/* Following */}
            {following.length > 0 && (
              <>
                <SectionHeader
                  title="Standsiders You Follow"
                  action="Manage"
                  onAction={() => {}}
                />
                {following.map(s => (
                  <StandsiderCard key={s.id} standsider={s} onToggle={() => toggleFollow(s.id)} />
                ))}
              </>
            )}

            {/* Suggested */}
            {suggested.length > 0 && (
              <>
                <SectionHeader title="Suggested Standsiders" />
                {suggested.map(s => (
                  <StandsiderCard key={s.id} standsider={s} onToggle={() => toggleFollow(s.id)} />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function ActivityItem({ standsider }) {
  return (
    <View style={styles.activityItem}>
      <Avatar
        initials={standsider.initials}
        color={standsider.avatarColor}
        size={36}
        fontSize={14}
      />
      <View style={styles.activityBody}>
        <Text style={styles.activityText}>
          <Text style={styles.activityName}>{standsider.name}</Text>
          {' '}{standsider.recentActivity}
        </Text>
        {standsider.recentMatch && (
          <View style={styles.activityMatchPill}>
            <Text style={styles.activityMatchText}>{standsider.recentMatch}</Text>
          </View>
        )}
        <Text style={styles.activityTime}>{standsider.timeAgo}</Text>
      </View>
    </View>
  );
}

function StandsiderCard({ standsider, onToggle }) {
  return (
    <View style={[styles.standsiderCard, shadow.sm]}>
      <Avatar
        initials={standsider.initials}
        color={standsider.avatarColor}
        size={44}
        fontSize={18}
      />
      <View style={styles.standsiderInfo}>
        <Text style={styles.standsiderName}>{standsider.name}</Text>
        <Text style={styles.standsiderStats}>{standsider.games} games · {standsider.programmes} programmes</Text>
        <Text style={styles.standsiderCounty}>{standsider.county}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followBtn, standsider.following ? styles.followBtnActive : styles.followBtnInactive]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={[styles.followBtnText, standsider.following ? styles.followBtnTextActive : styles.followBtnTextInactive]}>
          {standsider.following ? 'Following' : '+ Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  header: { paddingTop: 56 },
  brandmark: { fontSize: 11, fontFamily: typography.display, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginBottom: 8 },
  title: { fontSize: 22, fontFamily: typography.display, color: colors.white, marginBottom: 3 },
  subtitle: { fontSize: 12, color: colors.greenLight },

  body: { flex: 1 },
  content: { padding: spacing.lg },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 10,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1, fontSize: 13, color: colors.ink,
    paddingVertical: 0,
  },
  emptyText: { fontSize: 13, color: colors.muted, textAlign: 'center', marginVertical: spacing.lg },

  activityItem: {
    backgroundColor: colors.white,
    borderRadius: radius.lg, padding: 12,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', gap: 10,
    ...shadow.sm,
  },
  activityBody: { flex: 1 },
  activityText: { fontSize: 12, color: colors.ink, lineHeight: 18 },
  activityName: { fontWeight: '700', color: colors.green },
  activityMatchPill: {
    backgroundColor: colors.greenPale,
    borderRadius: radius.sm, paddingHorizontal: 9, paddingVertical: 4,
    alignSelf: 'flex-start', marginTop: 6,
    borderWidth: 1, borderColor: '#BEE0CA',
  },
  activityMatchText: { fontSize: 11, fontWeight: '600', color: colors.green },
  activityTime: { fontSize: 10, color: colors.muted, marginTop: 4 },

  standsiderCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg, padding: 12,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  standsiderInfo: { flex: 1 },
  standsiderName: { fontSize: 13, fontWeight: '600', color: colors.ink },
  standsiderStats: { fontSize: 11, color: colors.muted, marginTop: 2 },
  standsiderCounty: { fontSize: 10, color: colors.greenMid, fontWeight: '600', marginTop: 2 },

  followBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1.5,
  },
  followBtnActive: { backgroundColor: colors.green, borderColor: colors.green },
  followBtnInactive: { backgroundColor: 'transparent', borderColor: colors.green },
  followBtnText: { fontSize: 11, fontWeight: '700' },
  followBtnTextActive: { color: colors.white },
  followBtnTextInactive: { color: colors.green },
});
