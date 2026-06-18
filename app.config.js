module.exports = {
  expo: {
    newArchEnabled: true,
    name: "Moneyfy",
    slug: "Moneyfy",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    version: "1.0.2",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.moneyfy.app",
    },
    android: {
      enableProguardInReleaseBuilds: true,
      proguard: "./proguard-rules.pro",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.moneyfy.app",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-asset",
      [
        "@react-native-community/datetimepicker",
        {
          platforms: ["ios", "android"],
        },
      ],
      "expo-font",
      "expo-secure-store",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.API_URL,
      nodeEnv: process.env.NODE_ENV,
      router: {
        origin: false,
      },
      eas: {
        projectId: "55e44728-2579-414b-9197-05777a8d091f",
      },
    },
  },
};
