import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  StyleSheet, StatusBar, Animated, FlatList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Avatar, InfoRow, StatCell } from '../components';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { HURLING_TEAMS, FOOTBALL_TEAMS, MILESTONES } from '../data';

export default function ProfileScreen({ navigation }) {
  const { profile, stats } = useApp();
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brandmark}>STANDSIDE</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.identity}>
          <View style={styles.avatarWrap}>
            <Avatar
              initials={profile.avatarInitial}
              color={profile.avatarColor}
              size={66}
              fontSize={28}
            />
            <TouchableOpacity style={styles.avatarCameraBtn}>
              <Text style={{ fontSize: 10 }}>📷</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileHandle}>{profile.handle} · Standsider since {profile.since}</Text>
            <View style={styles.countyTag}>
              <Text style={styles.countyTagText}>📍 {profile.county}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerCurve} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={[styles.statsCard, shadow.sm]}>
          <StatCell value={stats.games} label="Games" />
          <StatCell value={stats.programmes} label="Programmes" />
          <StatCell value={stats.counties} label="Counties" />
          <StatCell value={stats.following} label="Following" isLast />
        </View>

        {/* Favourite Team */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Favourite Team</Text>
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>
        <FavTeamCard team={profile.favouriteTeam} onPress={() => setPickerVisible(true)} />

        {/* Milestones */}
        <View style={[styles.sectionRow, { marginTop: spacing.sm }]}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <TouchableOpacity><Text style={styles.changeLink}>View all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.milestonesScroll}>
          {MILESTONES.map(m => (
            <View key={m.id} style={[styles.milestoneCard, m.earned && styles.milestoneCardEarned]}>
              <Text style={[styles.milestoneIcon, !m.earned && styles.milestoneIconLocked]}>
                {m.icon}
              </Text>
              <Text style={[styles.milestoneName, !m.earned && styles.milestoneNameLocked]}>
                {m.name}
              </Text>
            </View>
          ))}
          <View style={{ width: spacing.lg }} />
        </ScrollView>

        {/* My Details */}
        <View style={[styles.sectionRow, { marginTop: spacing.sm }]}>
          <Text style={styles.sectionTitle}>My Details</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.changeLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, shadow.sm]}>
          <InfoRow label="Name" value={profile.name} onEdit={() => navigation.navigate('EditProfile')} />
          <InfoRow label="Home County" value={profile.county} onEdit={() => navigation.navigate('EditProfile')} />
          <InfoRow label="Favourite Sport" value={profile.favouriteTeam?.sport || '—'} />
          <InfoRow label="Standside Since" value={profile.since} isLast />
        </View>

        {/* Settings */}
        <View style={[styles.card, shadow.sm, { marginTop: 0 }]}>
          {[
            { icon: '🔔', label: 'Notifications', value: 'On' },
            { icon: '🔒', label: 'Privacy', value: 'Public' },
            { icon: '❓', label: 'Help & Feedback', value: '' },
          ].map((row, i) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.settingsRow, i < 2 && styles.settingsRowBorder]}
            >
              <Text style={styles.settingsKey}>{row.icon} {row.label}</Text>
              <Text style={styles.settingsVal}>{row.value} ›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={[styles.settingsKey, { color: colors.error }]}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Team Picker Modal */}
      <TeamPickerModal
        visible={pickerVisible}
        currentTeam={profile.favouriteTeam}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

// ─── Favourite Team Card ──────────────────────────────────────────────────────
function FavTeamCard({ team, onPress }) {
  if (!team) {
    return (
      <TouchableOpacity style={[styles.favTeamCard, styles.favTeamCardEmpty, shadow.sm]} onPress={onPress}>
        <Text style={styles.favTeamEmptyText}>Tap to choose your favourite team →</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.favTeamCard, shadow.sm]}>
      <View style={styles.teamCrest}>
        <Text style={{ fontSize: 28 }}>{team.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.favTeamName}>{team.name}</Text>
        <Text style={styles.favTeamSport}>{team.sport} · {team.province}</Text>
        <View style={styles.favTagRow}>
          <View style={styles.favTag}>
            <Text style={styles.favTagText}>{team.sport === 'Hurling' ? '⚾' : '🏈'} {team.sport}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Team Picker Modal ────────────────────────────────────────────────────────
function TeamPickerModal({ visible, currentTeam, onClose }) {
  const { updateProfile } = useApp();
  const [sport, setSport] = useState('Hurling');
  const [selected, setSelected] = useState(currentTeam?.name || null);
  const teams = sport === 'Hurling' ? HURLING_TEAMS : FOOTBALL_TEAMS;

  const handleConfirm = () => {
    const allTeams = [...HURLING_TEAMS, ...FOOTBALL_TEAMS];
    const team = allTeams.find(t => t.name === selected);
    if (team) {
      const teamSport = HURLING_TEAMS.find(t => t.name === selected) ? 'Hurling' : 'Gaelic Football';
      updateProfile({ favouriteTeam: { ...team, sport: teamSport } });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Choose Favourite Team</Text>

          {/* Sport toggle */}
          <View style={styles.sheetSportToggle}>
            {['Hurling', 'Gaelic Football'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.sheetSportBtn, sport === s && styles.sheetSportBtnActive]}
                onPress={() => { setSport(s); setSelected(null); }}
              >
                <Text style={[styles.sheetSportBtnText, sport === s && styles.sheetSportBtnTextActive]}>
                  {s === 'Hurling' ? '⚾' : '🏈'} {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Team grid */}
          <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.teamGrid}>
              {teams.map(team => (
                <TouchableOpacity
                  key={team.name}
                  style={[styles.teamCell, selected === team.name && styles.teamCellSelected]}
                  onPress={() => setSelected(team.name)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.teamCellEmoji}>{team.emoji}</Text>
                  <Text style={[styles.teamCellName, selected === team.name && styles.teamCellNameSelected]}>
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Confirm */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={!selected}
            >
              <Text style={styles.confirmBtnText}>
                {selected ? `Confirm: ${selected}` : 'Select a team'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  header: {
    backgroundColor: colors.green, paddingTop: 56,
    paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl + 8,
    position: 'relative',
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  brandmark: { fontSize: 11, fontFamily: typography.display, color: 'rgba(255,255,255,0.4)', letterSpacing: 3 },
  editBtn: {
    width: 30, height: 30, backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 9, alignItems: 'center', justifyContent: 'center',
  },
  editBtnText: { fontSize: 13 },

  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatarCameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, backgroundColor: colors.gold,
    borderRadius: 11, borderWidth: 2, borderColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
  },
  identityText: { flex: 1 },
  profileName: { fontSize: 20, fontFamily: typography.display, color: colors.white },
  profileHandle: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, marginBottom: 6 },
  countyTag: {
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start',
  },
  countyTagText: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  headerCurve: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 24, backgroundColor: colors.cream,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },

  body: { flex: 1 },
  content: { padding: spacing.lg },

  statsCard: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', marginBottom: spacing.lg,
  },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 15, fontFamily: typography.display, color: colors.ink },
  changeLink: { fontSize: 12, color: colors.greenMid, fontWeight: '600' },

  // Fav team
  favTeamCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.lg,
  },
  favTeamCardEmpty: { justifyContent: 'center', paddingVertical: spacing.xl },
  favTeamEmptyText: { fontSize: 13, color: colors.greenMid, fontWeight: '600', textAlign: 'center' },
  teamCrest: {
    width: 54, height: 54, borderRadius: 12,
    backgroundColor: colors.greenPale,
    alignItems: 'center', justifyContent: 'center',
  },
  favTeamName: { fontSize: 18, fontFamily: typography.display, color: colors.ink },
  favTeamSport: { fontSize: 11, color: colors.muted, marginTop: 2 },
  favTagRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 6 },
  favTag: { backgroundColor: colors.greenPale, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  favTagText: { fontSize: 10, fontWeight: '600', color: colors.green },

  // Milestones
  milestonesScroll: { marginBottom: spacing.md },
  milestoneCard: {
    width: 80, backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 12, alignItems: 'center', marginRight: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  milestoneCardEarned: { borderColor: colors.gold, backgroundColor: '#FFFBEF' },
  milestoneIcon: { fontSize: 24, marginBottom: 5 },
  milestoneIconLocked: { opacity: 0.3 },
  milestoneName: { fontSize: 9, fontWeight: '700', color: colors.ink, textAlign: 'center', lineHeight: 13 },
  milestoneNameLocked: { color: colors.muted },

  // Info card
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginBottom: spacing.md,
  },

  // Settings
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  settingsKey: { fontSize: 13, color: colors.ink },
  settingsVal: { fontSize: 12, color: colors.muted },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(20,26,20,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontFamily: typography.display, color: colors.ink, paddingHorizontal: spacing.xl, marginBottom: 12 },

  sheetSportToggle: {
    flexDirection: 'row', marginHorizontal: spacing.xl,
    backgroundColor: colors.greenPale, borderRadius: 10, padding: 3,
    marginBottom: 12, borderWidth: 1, borderColor: colors.border,
  },
  sheetSportBtn: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  sheetSportBtnActive: { backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  sheetSportBtnText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  sheetSportBtnTextActive: { color: colors.green },

  sheetScroll: { paddingHorizontal: spacing.xl },
  teamGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, paddingBottom: spacing.md,
  },
  teamCell: {
    width: '22%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4,
    borderRadius: 12, backgroundColor: colors.greenPale,
    borderWidth: 2, borderColor: 'transparent',
  },
  teamCellSelected: {
    borderColor: colors.green,
    shadowColor: colors.green, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  teamCellEmoji: { fontSize: 22, marginBottom: 4 },
  teamCellName: { fontSize: 9, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  teamCellNameSelected: { color: colors.green },

  sheetFooter: { padding: spacing.xl, paddingTop: spacing.md },
  confirmBtn: { backgroundColor: colors.green, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: colors.border },
  confirmBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
