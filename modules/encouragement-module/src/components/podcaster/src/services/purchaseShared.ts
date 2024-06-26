import { createEmailLinkUrl } from 'podverse-shared';
import { Alert, Linking, Platform } from 'react-native';
import Config from 'react-native-config';
import { getProducts, requestPurchase } from 'react-native-iap';
import { translate } from '../lib/i18n';
import { PV } from '../resources';

// Purchase items
const itemSkus = Platform.select({
  ios: [Config.PURCHASE_ITEM_SKU_IOS],
  android: [Config.PURCHASE_ITEM_SKU_ANDROID],
});

const _premiumMembership1Year = itemSkus[0];

export const buy1YearPremium = async () => {
  if (Config.IS_BETA) {
    Alert.alert(PV.Alerts.PAYMENT_DISABLED_BETA.title, PV.Alerts.PAYMENT_DISABLED_BETA.message, [
      { text: translate('Cancel') },
      {
        text: translate('Send Email'),
        onPress: () => Linking.openURL(createEmailLinkUrl(PV.Emails.BETA_MEMBERSHIP_RENEWAL)),
      },
    ]);
  } else {
    await getProducts({ skus: itemSkus });
    await requestPurchase({ sku: _premiumMembership1Year });
  }
};

export const displayFOSSPurchaseAlert = () => {
  Alert.alert(translate('Leaving App'), translate('FOSS purchase alert text'), [
    { text: translate('Cancel') },
    {
      text: translate('Renew Membership'),
      // use r.podverse.fm redirect to avoid app catching the URL as a deep link
      onPress: () => Linking.openURL('https://r.podverse.fm/extend-membership'),
    },
  ]);
};
