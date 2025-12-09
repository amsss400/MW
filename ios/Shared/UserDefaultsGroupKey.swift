//
//  UserDefaultsGroupKeys.swift
//  MalinWallet
//
//  Created by Marcos Rodriguez on 4/14/24.
//  Copyright © 2024 MalinWallet. All rights reserved.
//

import Foundation

enum UserDefaultsGroupKey: String {
  case GroupName = "group.com.malinwallet.app"
  case PreferredCurrency = "preferredCurrency"
  case WatchAppBundleIdentifier = "com.malinwallet.app.watch"
  case BundleIdentifier = "com.malinwallet.app"
  case ElectrumSettingsHost = "electrum_host"
  case ElectrumSettingsTCPPort = "electrum_tcp_port"
  case ElectrumSettingsSSLPort = "electrum_ssl_port"
  case AllWalletsBalance = "WidgetCommunicationAllWalletsSatoshiBalance"
  case AllWalletsLatestTransactionTime = "WidgetCommunicationAllWalletsLatestTransactionTime"
  case LatestTransactionIsUnconfirmed = "\"WidgetCommunicationLatestTransactionIsUnconfirmed\""
}
