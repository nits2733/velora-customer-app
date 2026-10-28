import { StyleSheet } from 'react-native';
import { Reveal } from '@/components/motion/Reveal';

/** Consistent vertical rhythm + one-time reveal on first scroll into view. */
export function Section({ children, stagger }: { children: React.ReactNode; stagger?: boolean }) {
  return (
    <Reveal animate={!stagger} style={styles.section}>
      {children}
    </Reveal>
  );
}

const styles = StyleSheet.create({ section: { marginTop: 32 } });
