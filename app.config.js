export default {
  expo: {
    name: "Wallet App",
    slug: "wallet-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",

    extra: {
      API_URL: "https://wallet-app-backend-six.vercel.app",
      CLERK_PUBLISHABLE_KEY:
        "pk_test_YmVjb21pbmctbWFzdGlmZi05NS5jbGVyay5hY2NvdW50cy5kZXYk",
    },

    android: {
      package: "com.mujtaba.walletapp",
    },
  },
};
