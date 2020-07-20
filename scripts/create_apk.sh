#!/bin/bash

cd cordova
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.keystores/android.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk android-app-key
$ANDROID_HOME/build-tools/29.0.3/zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app-release.apk
