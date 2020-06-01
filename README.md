# Bit Pong

## Demo

You can play the game [here](https://strahius.github.io/bit-pong/).

## Documents

[Google sheet](https://docs.google.com/spreadsheets/d/1H-hG4LRPIBHMkqvR9NmXc3TpwTdJBeRoHgtvHfrQhrs/edit#gid=2026791078) with features/issues/research etc.

## Publish APK

```
$ yarn cordova:build
$ cordova build --release android
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.keystores/android.keystore ./cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk android-app-key
$ /home/stathis/Android/android-sdk/build-tools/29.0.3/zipalign -v 4 ./cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app-release.apk
```
