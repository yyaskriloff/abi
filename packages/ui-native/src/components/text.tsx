import { Text as RNText, type TextProps } from "react-native";

export type AbiTextProps = TextProps & {
  className?: string;
};

export function Text({ className, ...props }: AbiTextProps) {
  return <RNText className={className} {...props} />;
}
