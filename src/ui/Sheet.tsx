import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useLayout } from '@/lib/useLayout';
import { useTheme } from '@/theme/ThemeProvider';
import { elevation2 } from '@/theme/tokens';
import { Button } from './Button';
import { Text } from './Text';

/**
 * Sheet / Modal (AddReminderSheet):
 *  - iOS: sheet with grabber, Cancel / Save in the header
 *  - Android: Material bottom sheet, actions at the bottom
 *  - Web: centred modal (desktop) or bottom sheet (mobile web)
 */
export function Sheet({
  visible, title, onClose, onSave, saveLabel, children,
}: { visible: boolean; title: string; onClose: () => void; onSave?: () => void; saveLabel?: string; children: React.ReactNode }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const insets = useSafeAreaInsets();
  const { webWide } = useLayout();
  const ios = th.platform === 'ios';
  const centred = webWide;
  return (
    <Modal visible={visible} transparent animationType={centred ? 'fade' : 'slide'} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable accessibilityLabel={t('nav.close')} onPress={onClose} style={{ flex: 1, backgroundColor: c.scrim, justifyContent: centred ? 'center' : 'flex-end', alignItems: centred ? 'center' : 'stretch' }}>
          <Pressable
            accessibilityViewIsModal
            onPress={(e) => e.stopPropagation()}
            style={[
              { backgroundColor: c.surface, maxHeight: '92%' },
              centred
                ? { width: 520, maxWidth: '92%', borderRadius: 20, ...elevation2 }
                : { borderTopLeftRadius: ios ? 12 : 28, borderTopRightRadius: ios ? 12 : 28, paddingBottom: insets.bottom + 12 },
            ]}
          >
            {!centred ? <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: c.borderStrong, marginTop: 8 }} /> : null}
            {ios || centred ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, minHeight: 52, borderBottomWidth: 1, borderColor: c.border }}>
                <Button variant="text" label={t('nav.cancel')} onPress={onClose} fullWidth={false} />
                <Text weight="600" size={17} heading>{title}</Text>
                {onSave ? <Button variant="text" label={saveLabel ?? t('nav.save')} onPress={onSave} fullWidth={false} /> : <View style={{ width: 60 }} />}
              </View>
            ) : (
              <Text variant="title" style={{ paddingHorizontal: 24, paddingTop: 16 }} heading>{title}</Text>
            )}
            <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
            {!ios && !centred && onSave ? (
              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end', paddingHorizontal: 16 }}>
                <Button variant="text" label={t('nav.cancel')} onPress={onClose} fullWidth={false} />
                <Button label={saveLabel ?? t('nav.save')} onPress={onSave} fullWidth={false} />
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
