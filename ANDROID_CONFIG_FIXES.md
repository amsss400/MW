# Configuration Android Corrigée pour MalinWallet

## android/app/build.gradle - VERSION CORRIGÉE

```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
    /* Folders */
    root = file("../../")
    reactNativeDir = file("../../node_modules/react-native")
    codegenDir = file("../../node_modules/@react-native/codegen")
    cliFile = file("../../node_modules/react-native/cli.js")

    /* Variants */
    debuggableVariants = ["debug"]

    /* Bundling */
    nodeExecutableAndArgs = ["node"]
    bundleCommand = "ram-bundle"
    bundleAssetName = "index.android.bundle"
    entryFile = file("../../index.js")
    extraPackagerArgs = []

    /* Hermes Commands */
    hermesCommand = "$rootDir/my-custom-hermesc/bin/hermesc"
    hermesFlags = ["-O", "-output-source-map"]

    /* Autolinking */
    autolinkLibrariesWithApp()
}

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = true

/**
 * The preferred build flavor of JavaScriptCore (JSC)
 */
def jscFlavor = 'io.github.react-native-community:jsc-android:2026004.+'

android {
    androidResources {
        noCompress += ["bundle"]
    }

    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "com.malinwallet.app"
    defaultConfig {
        applicationId "com.malinwallet.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "7.2.3"
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
        
        // Enable multidex
        multiDexEnabled true
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = '11'
        freeCompilerArgs += [
            "-Xopt-in=kotlin.ExperimentalStdlibApi",
            "-Xopt-in=kotlin.RequiresOptIn"
        ]
    }

    lintOptions {
        abortOnError false
        checkReleaseBuilds false
        disable 'MissingTranslation', 'ExtraTranslation'
    }

    sourceSets {
        main {
            assets.srcDirs = ['src/main/assets', 'src/main/res/assets']
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
            debuggable true
        }
        release {
            minifyEnabled enableProguardInReleaseBuilds
            shrinkResources enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
            proguardFile "${rootProject.projectDir}/../node_modules/detox/android/detox/proguard-rules-app.pro"
            signingConfig signingConfigs.release
        }
    }

    packagingOptions {
        exclude 'META-INF/proguard/androidx-*.pro'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE'
    }
}

task copyFiatUnits(type: Copy) {
    from '../../models/fiatUnits.json'
    into 'src/main/assets'
}

preBuild.dependsOn(copyFiatUnits)

dependencies {
    // React Native
    implementation("com.facebook.react:react-android")
    
    // AndroidX
    implementation 'androidx.appcompat:appcompat:1.7.1'
    implementation 'androidx.core:core-ktx:1.16.0'
    implementation 'androidx.work:work-runtime-ktx:2.10.5'
    implementation 'androidx.preference:preference-ktx:1.2.1'
    implementation 'androidx.constraintlayout:constraintlayout:2.2.1'
    
    // Material Design
    implementation 'com.google.android.material:material:1.12.0'
    
    // Compose
    implementation 'androidx.compose.ui:ui:1.9.4'
    implementation 'androidx.compose.material3:material3:1.3.2'
    
    // Kotlin
    implementation "org.jetbrains.kotlin:kotlin-stdlib:${rootProject.ext.kotlin_version}"
    
    // JSC
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
    
    // Testing
    androidTestImplementation('com.wix:detox:+')
    androidTestImplementation('com.wix:detox-assertions:+')
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.6.1'
    androidTestImplementation 'androidx.test:runner:1.6.2'
    
    // Firebase
    implementation 'com.google.firebase:firebase-core:21.1.1'
    implementation 'com.google.firebase:firebase-messaging:23.4.1'
    
    // Bugsnag
    implementation 'com.bugsnag:bugsnag-android:6.7.0'
}

apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.bugsnag.android.gradle'
```

## android/build.gradle - VERSION CORRIGÉE

```gradle
buildscript {
    ext {
        minSdkVersion = 24
        buildToolsVersion = "35.0.0"
        compileSdkVersion = 35
        targetSdkVersion = 35
        googlePlayServicesVersion = "16.+"
        googlePlayServicesIidVersion = "16.0.1"
        firebaseVersion = "17.3.4"
        firebaseMessagingVersion = "21.1.0"
        ndkVersion = "27.1.12297006"
        kotlin_version = '2.0.21'
        kotlinVersion = '2.0.21'
    }
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.2.0")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
        classpath 'com.google.gms:google-services:4.4.4'
        classpath("com.bugsnag:bugsnag-android-gradle-plugin:8.2.0")
    }
}

allprojects {
    repositories {
        maven {
            url("$rootDir/../node_modules/detox/Detox-android")
        }
        mavenCentral {
            content {
                excludeGroup "com.facebook.react"
            }
        }
        mavenLocal()
        maven {
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            url("$rootDir/../node_modules/jsc-android/dist")
        }
        google()
        maven { url 'https://www.jitpack.io' }
    }
}

subprojects {
    afterEvaluate {project ->
        if (project.hasProperty("android")) {
            android {
                buildToolsVersion "35.0.0"
                compileSdkVersion 35
                defaultConfig {
                    minSdkVersion 24
                    targetSdkVersion 35
                }
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_11
                    targetCompatibility JavaVersion.VERSION_11
                }
            }
        }
        tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile) {
            kotlinOptions.freeCompilerArgs += ["-Xopt-in=kotlin.ExperimentalStdlibApi"]
            if (project.plugins.hasPlugin("com.android.application") || project.plugins.hasPlugin("com.android.library")) {
                kotlinOptions.jvmTarget = android.compileOptions.sourceCompatibility
            } else {
                kotlinOptions.jvmTarget = sourceCompatibility
            }
        }
    }
}
```

## android/gradle.properties - VERSION CORRIGÉE

```properties
# Project-wide Gradle settings

# JVM arguments
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m

# Parallel builds
org.gradle.parallel=true
org.gradle.workers.max=4

# AndroidX
android.useAndroidX=true
android.enableJetifier=true

# Architecture
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# New Architecture
newArchEnabled=false

# Hermes
hermesEnabled=true

# Build cache
android.enableBuildCache=true

# Incremental annotation processing
android.incremental.annotation.processing=true

# Gradle daemon
org.gradle.daemon=true
org.gradle.daemon.idletimeout=60000
```

## proguard-rules.pro - VERSION CORRIGÉE

```proguard
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Bugsnag
-keep class com.bugsnag.** { *; }
-dontwarn com.bugsnag.**

# Crypto libraries
-keep class org.bouncycastle.** { *; }
-keep class org.spongycastle.** { *; }
-dontwarn org.bouncycastle.**
-dontwarn org.spongycastle.**

# Bitcoin libraries
-keep class org.bitcoinj.** { *; }
-dontwarn org.bitcoinj.**

# Ethereum libraries
-keep class org.web3j.** { *; }
-dontwarn org.web3j.**

# Solana libraries
-keep class com.solana.** { *; }
-dontwarn com.solana.**

# General rules
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
```
