# Reglas básicas de React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Mantener JSI
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Expo
-keep class expo.modules.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Mantener anotaciones importantes
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions 