import { Input } from "~/components/ui/input";
import { ComponentProps, useEffect, useState } from "react";

type NumericInputProps = {
  onValueChange?: (value: string) => void;
  onNumberChange?: (value: number) => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  defaultValue?: string;
  selectTextOnFocus?: boolean;
} & ComponentProps<typeof Input>;

export const NumericInput = ({
  onValueChange,
  onNumberChange,
  allowNegative,
  allowDecimal,
  defaultValue,
  selectTextOnFocus,
  ...rest
}: NumericInputProps) => {
  const [text, setText] = useState(defaultValue ?? "");
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: text.length,
  });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setText(defaultValue ?? "");
  }, [defaultValue]);

  const onTextChange = (text: string) => {
    text = text.replace(",", ".");
    const pattern = new RegExp(
      `[^0-9${allowNegative ? "-" : ""}${allowDecimal ? "\\." : ""}]`,
      "g",
    );
    text = text.replace(pattern, "");

    if (allowNegative && text.includes("-")) {
      text = (text.startsWith("-") ? "-" : "") + text.replace(/-/g, "");
    }

    if (allowDecimal) {
      const parts = text.split(".");
      if (parts.length > 2) {
        text = parts.shift() + "." + parts.join("");
      }
    }

    setText(text);

    if (onValueChange) {
      onValueChange(text);
    }
    if (onNumberChange) {
      const numberValue = Number(text);
      if (!isNaN(numberValue)) {
        onNumberChange(numberValue);
      } else {
        onNumberChange(0);
      }
    }
  };

  return (
    <Input
      value={text}
      onChangeText={onTextChange}
      selection={selection}
      onSelectionChange={(e) => {
        if (selectTextOnFocus && !focused) return;
        setSelection(e.nativeEvent.selection);
      }}
      onFocus={() => {
        if (!selectTextOnFocus) return;
        setSelection({ start: 0, end: text.length });
        setFocused(true);
      }}
      {...rest}
    />
  );
};
