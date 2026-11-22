import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button, ErrorView, LoadingView } from '@/components/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { findTimers, formatSeconds } from '@/lib/timers';
import { getMeal } from '@/lib/mealdb';

type RunningTimer = { label: string; endsAt: number; total: number };

export default function CookScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const meal = useAsync(() => getMeal(id), [id]);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState<RunningTimer | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const steps = meal.data?.steps ?? [];
  const step = steps[index] ?? '';
  const timers = useMemo(() => findTimers(step), [step]);

  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [timer]);

  const remaining = timer ? Math.max(0, Math.round((timer.endsAt - now) / 1000)) : 0;
  const finished = timer !== null && remaining === 0;

  useEffect(() => {
    if (finished && Platform.OS !== 'web') Vibration.vibrate([0, 400, 200, 400]);
  }, [finished]);

  const close = () => (router.canGoBack() ? router.back() : router.replace(`/recipe/${id}`));

  if (meal.status === 'loading' && !meal.data) return <LoadingView />;
  if (meal.status === 'error') return <ErrorView message={meal.error.message} onRetry={meal.reload} />;

  const isLast = index === steps.length - 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable onPress={close} accessibilityLabel="Exit cooking mode" hitSlop={12}>
            <ThemedText type="link" themeColor="textSecondary">
              ✕ Exit
            </ThemedText>
          </Pressable>
          <ThemedText type="smallBold" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>
            {meal.data?.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {index + 1}/{steps.length}
          </ThemedText>
        </View>

        <View style={[styles.progress, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={{
              width: `${((index + 1) / Math.max(steps.length, 1)) * 100}%`,
              height: '100%',
              backgroundColor: theme.accent,
              borderRadius: Radius.pill,
            }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <ThemedText type="caption" themeColor="accent" style={styles.overline}>
            Step {index + 1}
          </ThemedText>
          <ThemedText style={styles.stepText}>{step}</ThemedText>

          {timers.length ? (
            <View style={styles.timerChips}>
              {timers.map((t) => (
                <Button
                  key={t.label}
                  label={`Start ${t.label} timer`}
                  emoji="⏱️"
                  variant="secondary"
                  onPress={() => {
                    setNow(Date.now());
                    setTimer({ label: t.label, total: t.seconds, endsAt: Date.now() + t.seconds * 1000 });
                  }}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>

        {timer ? (
          <View style={[styles.timer, { backgroundColor: finished ? theme.successSoft : theme.accentSoft }]}>
            <View style={{ flex: 1 }}>
              <ThemedText type="caption" themeColor={finished ? 'success' : 'accent'}>
                {finished ? 'Time’s up!' : `${timer.label} timer`}
              </ThemedText>
              <ThemedText type="heading" style={{ fontVariant: ['tabular-nums'] }}>
                {finished ? '✅ Done' : formatSeconds(remaining)}
              </ThemedText>
            </View>
            <Pressable onPress={() => setTimer(null)} hitSlop={10} accessibilityLabel="Dismiss timer">
              <ThemedText type="link">{finished ? 'Dismiss' : 'Cancel'}</ThemedText>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.nav}>
          <Button
            label="Back"
            variant="secondary"
            style={{ flex: 1 }}
            disabled={index === 0}
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
          />
          <Button
            label={isLast ? 'Finish 🎉' : 'Next step'}
            style={{ flex: 2 }}
            onPress={() => (isLast ? close() : setIndex((i) => Math.min(steps.length - 1, i + 1)))}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progress: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 700,
  },
  stepText: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: 500,
  },
  timerChips: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.large,
    gap: Spacing.three,
  },
  nav: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
