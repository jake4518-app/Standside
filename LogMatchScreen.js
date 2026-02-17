import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../components';
import { colors, spacing, radius, typography } from '../theme';
import { COMPETITIONS } from '../data';

const SPORT_OPTIONS = ['Hurling', 'Gaelic Football'];

export default function LogMatchScreen({ navigation }) {
  const { addMatch } = useApp();
  const [sport, setSport] = useState('Hurling');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeGoals, setHomeGoals] = useState('');
  const [homePoints, setHomePoints] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  const [awayPoints, setAwayPoints] = useState('');
  const [venue, setVenue] = useState('');
  const [competition, setCompetition] = useState(COMPETITIONS[0]);
  const [notes, setNotes] = useState('');
  const [hasProgramme, setHasProgramme] = useState(false);
  const [competitionOpen, setCompetitionOpen] = useState(false);

  const handleSave = () => {
    if (!homeTeam || !awayTeam) {
      Alert.alert('Missing Info', 'Please enter both team names.');
      return;
    }
    addMatch({
      sport,
      homeTeam,
      awayTeam,
      homeScore: { goals: parseInt(homeGoals) || 0, points: parseInt(homePoints) || 0 },
      awayScore: { goals: parseInt(awayGoals) || 0, points: parseInt(awayPoints) || 0 },
      date: new Date().toISOString().split('T')[0],
      venue: venue || 'Unknown Venue',
      competition,
      hasProgramme,
      notes,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log a Match</Text>
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
        {/* Sport toggle */}
        <Text style={styles.sectionLabel}>Sport</Text>
        <View style={styles.sportToggle}>
          {SPORT_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sportBtn, sport === s && styles.sportBtnActive]}
              onPress={() => setSport(s)}
            >
              <Text style={[styles.sportBtnText, sport === s && styles.sportBtnTextActive]}>
                {s === 'Hurling' ? '⚾' : '🏈'} {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Match info */}
        <Text style={styles.sectionLabel}>Match Info</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Home Team</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kilkenny"
            placeholderTextColor={colors.muted}
            value={homeTeam}
            onChangeText={setHomeTeam}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Away Team</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tipperary"
            placeholderTextColor={colors.muted}
            value={awayTeam}
            onChangeText={setAwayTeam}
          />
        </View>

        <View style={styles.twoCol}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 13, color: colors.ink }}>
                {new Date().toLocaleDateString('en-IE')}
              </Text>
            </View>
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Competition</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCompetitionOpen(!competitionOpen)}
            >
              <Text style={{ fontSize: 12, color: colors.ink }} numberOfLines={1}>
                {competition}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {competitionOpen && (
          <View style={styles.dropdown}>
            {COMPETITIONS.map(c => (
              <TouchableOpacity
                key={c}
                style={styles.dropdownItem}
                onPress={() => { setCompetition(c); setCompetitionOpen(false); }}
              >
                <Text style={[styles.dropdownText, c === competition && styles.dropdownTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Venue</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Croke Park, Dublin"
            placeholderTextColor={colors.muted}
            value={venue}
            onChangeText={setVenue}
          />
        </View>

        {/* Score */}
        <Text style={styles.sectionLabel}>Score</Text>
        <View style={styles.scoreSection}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreTeamName}>{homeTeam || 'Home Team'}</Text>
            <View style={styles.scoreInputs}>
              <TextInput
                style={styles.scoreBox}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.greenMid}
                value={homeGoals}
                onChangeText={setHomeGoals}
                maxLength={2}
              />
              <Text style={styles.scoreSep}>-</Text>
              <TextInput
                style={styles.scoreBox}
                keyboardType="number-pad"
                placeholder="00"
                placeholderTextColor={colors.greenMid}
                value={homePoints}
                onChangeText={setHomePoints}
                maxLength={2}
              />
            </View>
          </View>
          <View style={[styles.scoreRow, { marginTop: spacing.sm }]}>
            <Text style={styles.scoreTeamName}>{awayTeam || 'Away Team'}</Text>
            <View style={styles.scoreInputs}>
              <TextInput
                style={styles.scoreBox}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.greenMid}
                value={awayGoals}
                onChangeText={setAwayGoals}
                maxLength={2}
              />
              <Text style={styles.scoreSep}>-</Text>
              <TextInput
                style={styles.scoreBox}
                keyboardType="number-pad"
                placeholder="00"
                placeholderTextColor={colors.greenMid}
                value={awayPoints}
                onChangeText={setAwayPoints}
                maxLength={2}
              />
            </View>
          </View>
        </View>

        {/* Programme upload */}
        <Text style={styles.sectionLabel}>Programme</Text>
        <TouchableOpacity
          style={[styles.uploadZone, hasProgramme && styles.uploadZoneActive]}
          onPress={() => setHasProgramme(!hasProgramme)}
        >
          <Text style={styles.uploadIcon}>{hasProgramme ? '✅' : '📄'}</Text>
          <Text style={styles.uploadTitle}>
            {hasProgramme ? 'Programme Added!' : 'Upload Programme'}
          </Text>
          <Text style={styles.uploadSub}>
            {hasProgramme ? 'Tap to remove' : 'Take a photo or choose from library'}
          </Text>
        </TouchableOpacity>

        {/* Notes */}
        <Text style={styles.sectionLabel}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="How was the atmosphere? Any memorable moments?"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />

        <PrimaryButton title="Save to My Standside" onPress={handleSave} style={{ marginTop: spacing.md }} />
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

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.muted,
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },

  sportToggle: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: radius.md, padding: 4,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  sportBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  sportBtnActive: { backgroundColor: colors.green },
  sportBtnText: { fontSize: 12, fontWeight: '500', color: colors.muted },
  sportBtnTextActive: { color: colors.white, fontWeight: '600' },

  field: { marginBottom: spacing.md },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 13, color: colors.ink, fontFamily: undefined,
    justifyContent: 'center',
  },
  twoCol: { flexDirection: 'row', gap: spacing.md },

  dropdown: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, marginBottom: spacing.md,
    overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 13, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownText: { fontSize: 13, color: colors.ink },
  dropdownTextActive: { color: colors.green, fontWeight: '700' },

  scoreSection: {
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreTeamName: { fontSize: 13, fontWeight: '600', color: colors.ink, flex: 1 },
  scoreInputs: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scoreBox: {
    width: 40, height: 38, backgroundColor: colors.greenPale,
    borderRadius: 8, textAlign: 'center',
    fontSize: 16, fontFamily: typography.display,
    color: colors.green, fontWeight: '700',
  },
  scoreSep: { fontSize: 16, color: colors.muted, fontWeight: '700' },

  uploadZone: {
    backgroundColor: colors.white,
    borderWidth: 2, borderColor: colors.greenLight,
    borderStyle: 'dashed', borderRadius: radius.lg,
    padding: 20, alignItems: 'center',
    marginBottom: spacing.sm,
  },
  uploadZoneActive: { backgroundColor: colors.greenPale, borderColor: colors.green, borderStyle: 'solid' },
  uploadIcon: { fontSize: 28, marginBottom: 6 },
  uploadTitle: { fontSize: 13, fontWeight: '600', color: colors.green },
  uploadSub: { fontSize: 11, color: colors.muted, marginTop: 3 },

  notesInput: { height: 100, paddingTop: 11 },
});
