import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { PrimaryButton, Avatar } from '../components';
import { colors, spacing, radius, typography } from '../theme';
import { COUNTIES } from '../data';

export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useApp();

  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [county, setCounty] = useState(profile.county);
  const [countyOpen, setCountyOpen] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter your name.');
      return;
    }
    updateProfile({ name, handle, bio, county });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveLink}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Avatar
              initials={profile.avatarInitial}
              color={profile.avatarColor}
              size={80}
              fontSize={34}
            />
            <TouchableOpacity style={styles.avatarCameraBtn}>
              <Text style={{ fontSize: 12 }}>📷</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal info */}
        <Text style={styles.sectionLabel}>Personal Info</Text>
        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldRowLabel}>Display Name</Text>
            <TextInput
              style={styles.fieldRowInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={[styles.fieldRow, styles.fieldRowBorder]}>
            <Text style={styles.fieldRowLabel}>Username</Text>
            <TextInput
              style={styles.fieldRowInput}
              value={handle}
              onChangeText={setHandle}
              placeholder="@handle"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
            />
          </View>
          <View style={[styles.fieldRow, styles.fieldRowBorder, { alignItems: 'flex-start', paddingTop: 11 }]}>
            <Text style={[styles.fieldRowLabel, { paddingTop: 2 }]}>Bio</Text>
            <TextInput
              style={[styles.fieldRowInput, { height: 64, textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell other standsiders about yourself"
              placeholderTextColor={colors.muted}
              multiline
            />
          </View>
        </View>

        {/* Location */}
        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.fieldCard}>
          <TouchableOpacity
            style={styles.fieldRow}
            onPress={() => setCountyOpen(!countyOpen)}
          >
            <Text style={styles.fieldRowLabel}>Home County</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.fieldRowValue}>{county}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{countyOpen ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {countyOpen && (
          <View style={styles.countyDropdown}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {COUNTIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={styles.countyItem}
                  onPress={() => { setCounty(c); setCountyOpen(false); }}
                >
                  <Text style={[styles.countyItemText, c === county && styles.countyItemTextActive]}>
                    {c}
                  </Text>
                  {c === county && <Text style={{ color: colors.green }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Favourite team shortcut */}
        <Text style={styles.sectionLabel}>Favourite Team</Text>
        <TouchableOpacity
          style={styles.favTeamRow}
          onPress={() => {
            navigation.goBack();
            // Profile screen will open the picker
          }}
        >
          <View style={styles.favTeamLeft}>
            <View style={styles.favTeamCrest}>
              <Text style={{ fontSize: 20 }}>{profile.favouriteTeam?.emoji || '⚽'}</Text>
            </View>
            <View>
              <Text style={styles.favTeamName}>{profile.favouriteTeam?.name || 'Not set'}</Text>
              <Text style={styles.favTeamSport}>{profile.favouriteTeam?.sport || 'Choose a team'}</Text>
            </View>
          </View>
          <Text style={styles.changeLink}>Change ›</Text>
        </TouchableOpacity>

        {/* Account info (read-only) */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldRowLabel}>Standside Since</Text>
            <Text style={styles.fieldRowValue}>{profile.since}</Text>
          </View>
          <View style={[styles.fieldRow, styles.fieldRowBorder]}>
            <Text style={styles.fieldRowLabel}>County</Text>
            <Text style={styles.fieldRowValue}>{county}</Text>
          </View>
        </View>

        <PrimaryButton title="Save Changes" onPress={handleSave} style={{ marginTop: spacing.md }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: spacing.lg, paddingTop: 56, paddingBottom: spacing.md,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: colors.greenPale,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { fontSize: 16, color: colors.green, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: typography.display, color: colors.ink },
  saveLink: { fontSize: 14, fontWeight: '600', color: colors.greenMid },

  body: { flex: 1 },
  content: { padding: spacing.lg },

  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatarCameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, backgroundColor: colors.gold,
    borderRadius: 13, borderWidth: 2, borderColor: colors.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  changePhotoText: { fontSize: 13, color: colors.greenMid, fontWeight: '600' },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.muted,
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },

  fieldCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 11,
  },
  fieldRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  fieldRowLabel: { fontSize: 12, color: colors.muted, width: 100 },
  fieldRowInput: {
    flex: 1, fontSize: 14, fontWeight: '600', color: colors.ink,
    textAlign: 'right', paddingVertical: 0,
  },
  fieldRowValue: { fontSize: 14, fontWeight: '600', color: colors.ink },

  countyDropdown: {
    backgroundColor: colors.white, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm, overflow: 'hidden',
  },
  countyItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  countyItemText: { fontSize: 14, color: colors.ink },
  countyItemTextActive: { color: colors.green, fontWeight: '700' },

  favTeamRow: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  favTeamLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favTeamCrest: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: colors.greenPale,
    alignItems: 'center', justifyContent: 'center',
  },
  favTeamName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  favTeamSport: { fontSize: 11, color: colors.muted, marginTop: 2 },
  changeLink: { fontSize: 13, fontWeight: '600', color: colors.greenMid },
});
