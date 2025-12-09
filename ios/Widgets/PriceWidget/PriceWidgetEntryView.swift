//
//  PriceWidgetEntryView.swift
//  MalinWallet
//
//  Created by Marcos Rodriguez on 10/27/24.
//  Copyright © 2024 MalinWallet. All rights reserved.
//

import SwiftUI


@available(iOS 16.0, *)
struct PriceWidgetEntryView: View {
    let entry: PriceWidgetEntry

    var body: some View {
        PriceView(entry: entry)
    }
}
