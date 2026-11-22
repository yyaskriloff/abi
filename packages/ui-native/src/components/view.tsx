import { View as RNView, type ViewProps } from "react-native";

export type AbiViewProps = ViewProps & {
  className?: string;
};

export function View({ className, ...props }: AbiViewProps) {
  return <RNView className={className} {...props} />;
}
