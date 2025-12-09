//
//  Handoff.swift
//  MalinWalletWatch Extension
//
//  Created by Admin on 9/27/21.
//  Copyright © 2021 MalinWallet. All rights reserved.
//

import Foundation

enum HandoffIdentifier: String {
  case ReceiveOnchain = "com.malinwallet.app.receiveonchain"
  case Xpub = "com.malinwallet.app.xpub"
  case ViewInBlockExplorer = "com.malinwallet.app.blockexplorer"
}

enum HandOffUserInfoKey: String {
  case ReceiveOnchain = "address"
  case Xpub = "xpub"
}

enum HandOffTitle: String {
  case ReceiveOnchain = "View Address"
  case Xpub = "View XPUB"
}
