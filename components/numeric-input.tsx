import { Input } from "~/components/ui/input";
import { ComponentProps, useState } from "react";

type NumericInputProps = {
  onValueChange: (value: number) => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  defaultValue?: string;
} & ComponentProps<typeof Input>;

export const NumericInput = ({
  onValueChange,
  allowNegative,
  allowDecimal,
  defaultValue,
  ...rest
}: NumericInputProps) => {
  const [text, setText] = useState(defaultValue || "");

  const onTextChange = (text: string) => {
    text = text.replace(",", ".");
    text.replace(
      `/[^0-9${allowNegative ? "-" : ""}${allowDecimal ? "." : ""}]/g`,
      "",
    );

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

  return <Input value={text} onChangeText={onTextChange} {...rest} />;
};
