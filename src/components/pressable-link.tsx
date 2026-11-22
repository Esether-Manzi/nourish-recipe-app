import { router, type Href } from 'expo-router';
import { Pressable, type PressableProps } from 'react-native';

/**
 * A Pressable that navigates on press. Used instead of `<Link asChild>` because Link's slot
 * drops Pressable's function-style on web.
 */
export function PressableLink({ href, onPress, ...rest }: PressableProps & { href: Href }) {
  return (
    <Pressable
      accessibilityRole="link"
      {...rest}
      onPress={(event) => {
        onPress?.(event);
        router.push(href);
      }}
    />
  );
}
