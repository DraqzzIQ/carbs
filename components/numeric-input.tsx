import { Input } from "~/components/ui/input";
import { ComponentProps, useEffect, useState } from "react";

type NumericInputProps = {
  onValueChange: (value: number) => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  defaultValue?: string;
  selectTextOnFocus?: boolean;
} & ComponentProps<typeof Input>;

export const NumericInput = ({
  onValueChange,
  allowNegative,
  allowDecimal,
  defaultValue,
  selectTextOnFocus,
  ...rest
}: NumericInputProps) => {
  const [text, setText] = useState(defaultValue || "");
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: text.length,
  });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setText(defaultValue || "");
  }, [defaultValue]);

  const onTextChange = (text: string) => {
    text = text.replace(",", ".");
    const pattern = new RegExp(
      `[^0-9${allowNegative ? "-" : ""}${allowDecimal ? "\\." : ""}]`,
      "g",
    );
    text = text.replace(pattern, "");

    if (allowNegative && text.includes("-")) {
      text = (text[0] === "-" ? "-" : "") + text.replace(/-/g, "");
    }

    if (allowDecimal) {
      const parts = text.split(".");
      if (parts.length > 2) {
        text = parts.shift() + "." + parts.join("");
      }
      if (text.endsWith(".") && parts.length === 2) {
        setText(text);
        onValueChange(Number(text.slice(0, -1)));
        return;
      }
    }

    setText(text);
    const num = Number(text);
    if (!isNaN(num)) {
      onValueChange(num);
    } else {
      onValueChange(0);
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
