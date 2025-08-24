import * as React from "react";
import { TextInput, type TextInputProps, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { cn } from "~/lib/utils";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps & { className?: string; placeholderClassName?: string }
>(({ className, placeholderClassName, secureTextEntry, ...props }, ref) => {
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  const isSecure = secureTextEntry !== undefined;

  return (
    <View className="relative web:w-full">
      <TextInput
        ref={ref}
        secureTextEntry={isSecure && !isPasswordVisible}
        className={cn(
          "web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 pr-10", // space for icon
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />

      {isSecure && (
        <Pressable
          onPress={() => setPasswordVisible((prev) => !prev)}
          className="absolute right-3 top-[50%] -translate-y-1/2"
        >
          <Feather
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#6b7280"
          />
        </Pressable>
      )}
    </View>
  );
});

Input.displayName = "Input";

export { Input };
