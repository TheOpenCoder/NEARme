import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import * as IntentLauncher from 'expo-intent-launcher';

export const deniedPermissionHelper = () => {

    const openApplicationSettingsPkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package
        : 'host.exp.exponent';

    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
    } else {
        IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
            { data: 'package:' + openApplicationSettingsPkg },
        )
    }

}