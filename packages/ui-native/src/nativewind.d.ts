import "react-native";

declare module "react-native" {
  interface TextProps {
    className?: string;
  }

  interface ViewProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }

  // React Native's SafeAreaView props live on ViewProps in some versions;
  // keep className available for common usage in apps.
  interface TouchableOpacityProps {
    className?: string;
  }
}
