#!/bin/bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export JAVA_HOME="${JAVA_HOME:-$HOME/.jdks/jdk-17.0.19+10}"
export PATH="$JAVA_HOME/bin:$HOME/.local/opt/gradle-8.13/bin:$PATH"

BUILD_TOOLS="$ANDROID_HOME/build-tools/36.0.0"
KEYSTORE="${KEYSTORE:-$HOME/.android/bit-pong-upload.keystore}"
KEY_ALIAS="${KEY_ALIAS:-upload}"

cd cordova

# Release AAB (what Google Play wants). Bundles are signed with jarsigner.
cordova build android --release
jarsigner -keystore "$KEYSTORE" \
  ./platforms/android/app/build/outputs/bundle/release/app-release.aab "$KEY_ALIAS"
cp ./platforms/android/app/build/outputs/bundle/release/app-release.aab ../app-release.aab

# Release APK (for sideloading/testing). Needs v2+ signing: zipalign, then apksigner.
cordova build android --release -- --packageType=apk
"$BUILD_TOOLS/zipalign" -f -p 4 \
  ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  ../app-release-aligned.apk
"$BUILD_TOOLS/apksigner" sign --ks "$KEYSTORE" --ks-key-alias "$KEY_ALIAS" \
  --out ../app-release.apk ../app-release-aligned.apk
rm ../app-release-aligned.apk
