import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PressableLink } from '@/components/pressable-link';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyView, SectionHeader } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { COUNTRIES, flagOf, REGIONS, type Region } from '@/data/countries';
import { useTheme } from '@/hooks/use-theme';

export default function WorldScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<Region | 'All'>('All');

  const countries = useMemo(
    () =>
      COUNTRIES.filter(
        (c) =>
          (region === 'All' || c.region === region) &&
          c.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, region],
  );

  return (
    <Screen>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="title">World kitchen</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Travelling, or just curious? Explore what people eat in {COUNTRIES.length} countries.
        </ThemedText>
      </View>

      <PressableLink
        href={{ pathname: '/country/[code]', params: { code: 'UG' } }}
        style={({ pressed }) => [
          styles.featured,
          { backgroundColor: theme.warningSoft, opacity: pressed ? 0.85 : 1 },
        ]}>
        <ThemedText style={{ fontSize: 40, lineHeight: 48 }}>{flagOf('UG')}</ThemedText>
        <View style={{ flex: 1 }}>
          <ThemedText type="subtitle" themeColor="warning">
            Home-style Ugandan kitchen
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Rolex, katogo, luwombo and more, made with everyday market ingredients.
          </ThemedText>
        </View>
        <ThemedText type="heading" themeColor="warning">
          ›
        </ThemedText>
      </PressableLink>

      <View style={{ gap: Spacing.three }}>
        <View
          style={[styles.inputWrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText>🌍</ThemedText>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Find a country"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            autoCorrect={false}
            accessibilityLabel="Find a country"
          />
        </View>
        <View style={styles.wrap}>
          {(['All', ...REGIONS] as const).map((r) => (
            <Chip key={r} label={r} selected={region === r} onPress={() => setRegion(r)} />
          ))}
        </View>
      </View>

      <View style={{ gap: Spacing.three }}>
        <SectionHeader
          title={region === 'All' ? 'All countries' : region}
          subtitle={`${countries.length} countries`}
        />
        {countries.length ? (
          <View style={styles.grid}>
            {countries.map((c) => (
              <PressableLink
                key={c.code}
                href={{ pathname: '/country/[code]', params: { code: c.code } }}
                accessibilityLabel={c.name}
                style={({ pressed }) => [
                  styles.tile,
                  { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.75 : 1 },
                ]}>
                <ThemedText style={{ fontSize: 30, lineHeight: 38 }}>{flagOf(c.code)}</ThemedText>
                <ThemedText type="caption" style={{ textAlign: 'center' }} numberOfLines={2}>
                  {c.name}
                </ThemedText>
              </PressableLink>
            ))}
          </View>
        ) : (
          <EmptyView emoji="🧭" title="No match" message="We don’t have recipes for that country yet." />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  featured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: '31.5%',
    minHeight: 86,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
    gap: Spacing.one,
  },
});
