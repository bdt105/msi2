export JAVA_HOME=/usr/lib/jvm/java-8-oracle
export ANDROID_HOME=/home/bernard/Android/Sdk
#ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=742844408965-rnhqbdeg9cg1ptkhp5tufpaj5e64sm96.apps.googleusercontent.com
rm -rf ./platforms/android
rm -f ./www/msi.apk
# ionic cordova build --release android
ionic cordova build --prod --release android
##keytool -genkey -v -keystore msi.keystore -alias msi -keyalg RSA -keysize 2048 -validity 10000
/home/bernard/Android/Sdk/build-tools/28.0.2/zipalign -v 4 /home/bernard/development/msi2/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./www/msi.apk
cp /home/bernard/development/msi2/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./www/msi.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore msi.keystore -storepass deregnau72 ./www/msi.apk msi