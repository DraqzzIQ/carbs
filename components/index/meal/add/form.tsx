import { useState, useEffect, ReactNode } from "react";
import { View, TouchableOpacity, StyleProp, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "~/components/ui/text";
import { NumericInput } from "~/components/numeric-input";
import { Input } from "~/components/ui/input";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  SaveIcon,
} from "lucide-nativewind";
import { FloatingActionButton } from "~/components/floating-action-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardTitle } from "~/components/ui/card";
import { FlashList } from "@shopify/flash-list";

export enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
}

type Field = {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  selectTextOnFocus?: boolean;
  options?: string[];
  type: FieldType;
  style?: StyleProp<any>;
};

type FieldOrRow = Field | Field[];

export type FormCategory = {
  category: string;
  fields: FieldOrRow[];
  defaultVisible: number;
  style?: StyleProp<any>;
  titleStyle?: number;
};

type FoodFormProps = {
  formConfig: FormCategory[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  edit?: boolean;
  children?: ReactNode;
};

export function Form({
  formConfig,
  onSubmit,
  edit = false,
  children,
}: FoodFormProps) {
  const getInitialForm = () => {
    const initial: Record<string, string> = {};
    formConfig.forEach((cat) => {
      cat.fields.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((field) => {
            if (field.defaultValue !== undefined) {
              initial[field.key] = field.defaultValue;
            }
          });
        } else {
          if (item.defaultValue !== undefined) {
            initial[item.key] = item.defaultValue;
          }
        }
      });
    });
    return initial;
  };

  const [form, setForm] = useState<Record<string, string>>(getInitialForm());
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setForm(getInitialForm());
  }, [formConfig]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (
      formConfig.some((cat) =>
        cat.fields.some((item) =>
          Array.isArray(item)
            ? item.some((f) => f.key === key && f.required)
            : item.key === key && item.required,
        ),
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        [key]: value ? "" : "This field is required",
      }));
    }
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (
      formConfig.some((cat) =>
        cat.fields.some((item) =>
          Array.isArray(item)
            ? item.some((f) => f.key === key && f.required)
            : item.key === key && item.required,
        ),
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        [key]: form[key] ? "" : "This field is required",
      }));
    }
  };

  const handleSubmit = async () => {
    let newErrors: Record<string, string> = {};
    formConfig.forEach((cat) => {
      cat.fields.forEach((item) => {
        const fields = Array.isArray(item) ? item : [item];
        fields.forEach((field) => {
          if (field.required && !form[field.key]) {
            newErrors[field.key] = "This field is required";
          } else if (field.type === FieldType.Number && form[field.key]) {
            const value = Number(form[field.key]);
            if (isNaN(value)) {
              newErrors[field.key] = "Please enter a valid number";
            }
          }
        });
      });
    });
    setErrors(newErrors);
    setTouched(
      Object.fromEntries(Object.keys(newErrors).map((k) => [k, true])),
    );
    if (Object.keys(newErrors).length === 0) {
      await onSubmit(form);
    }
  };

  return (
    <View className="h-full p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {children}
        {formConfig.map((cat, idx) => {
          const visibleCount = showMore[cat.category]
            ? cat.fields.length
            : cat.defaultVisible;
          return (
            <Card key={idx} className="p-4 mt-2" style={cat.style}>
              {cat.category !== "" && cat.titleStyle === 2 ? (
                <CardTitle className="mb-4 text-center">
                  {cat.category}
                </CardTitle>
              ) : (
                <CardTitle className="mb-4 text-lg">{cat.category}</CardTitle>
              )}
              {cat.fields.slice(0, visibleCount).map((item, idx) =>
                Array.isArray(item) ? (
                  <View key={idx} className="flex-row gap-2 mb-2">
                    {item.map((field) => (
                      <View
                        key={field.key}
                        style={StyleSheet.flatten([{ flex: 1 }, field.style])}
                      >
                        <Field
                          field={field}
                          value={form[field.key]}
                          onChange={(v: string) => handleChange(field.key, v)}
                          onBlur={() => handleBlur(field.key)}
                          error={errors[field.key]}
                          touched={touched[field.key]}
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View key={item.key} className="mb-2" style={item.style}>
                    <Field
                      field={item}
                      value={form[item.key]}
                      onChange={(v: string) => handleChange(item.key, v)}
                      onBlur={() => handleBlur(item.key)}
                      error={errors[item.key]}
                      touched={touched[item.key]}
                    />
                  </View>
                ),
              )}
              {cat.fields.length > cat.defaultVisible && (
                <TouchableOpacity
                  className="flex-row items-center mt-2"
                  onPress={() =>
                    setShowMore((prev) => ({
                      ...prev,
                      [cat.category]: !prev[cat.category],
                    }))
                  }
                >
                  {showMore[cat.category] ? (
                    <ChevronUpIcon className="text-primary" />
                  ) : (
                    <ChevronDownIcon className="text-primary" />
                  )}
                  <Text className="text-primary">
                    {showMore[cat.category] ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })}
        <View className="h-20" />
      </ScrollView>
      <FloatingActionButton
        onPress={async () => {
          setIsLoading(true);
          await handleSubmit();
          setIsLoading(false);
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        {edit ? (
          <SaveIcon className="text-secondary h-9 w-9" />
        ) : (
          <PlusIcon className="text-secondary h-9 w-9" />
        )}
      </FloatingActionButton>
    </View>
  );
}

type FieldProps = {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
};

function Field({ field, value, onChange, onBlur, error, touched }: FieldProps) {
  return (
    <>
      <Text className="text-base text-primary">{field.label}</Text>
      {(() => {
        switch (field.type) {
          case FieldType.Text:
            return (
              <TextField
                field={field}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error}
                touched={touched}
              />
            );
          case FieldType.Number:
            return (
              <NumberField
                field={field}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error}
                touched={touched}
              />
            );
          case FieldType.Select:
            return (
              <SelectField
                field={field}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error}
                touched={touched}
              />
            );
          default:
            return null;
        }
      })()}
      {field.required && touched && error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </>
  );
}

function TextField({
  field,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: FieldProps) {
  return (
    <Input
      selectTextOnFocus={field.selectTextOnFocus ?? true}
      placeholder={
        field.placeholder ?? (field.required ? "(required)" : "(optional)")
      }
      value={value ?? ""}
      onChangeText={onChange}
      onBlur={onBlur}
      className={`${field.required && touched && error ? "border-red-500" : ""} bg-secondary`}
    />
  );
}

function NumberField({
  field,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: FieldProps) {
  return (
    <NumericInput
      allowDecimal={field.allowDecimal ?? false}
      allowNegative={field.allowNegative ?? false}
      selectTextOnFocus={field.selectTextOnFocus ?? true}
      placeholder={
        field.placeholder ?? (field.required ? "(required)" : "(optional)")
      }
      defaultValue={value ?? ""}
      onValueChange={onChange}
      onBlur={onBlur}
      className={`${field.required && touched && error ? "border-red-500" : ""} bg-secondary`}
    />
  );
}

function SelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: FieldProps) {
  return (
    <Select
      value={value ? { value, label: value } : undefined}
      onValueChange={(v) => onChange(v?.value ?? "")}
      onOpenChange={(open) => {
        if (!open) onBlur();
      }}
    >
      <SelectTrigger
        className={`bg-secondary ${field.required && touched && error ? "border-red-500" : ""}`}
      >
        <SelectValue
          className={`${value ? "text-primary" : "text-muted-foreground"}`}
          placeholder={
            field.placeholder ?? (field.required ? "(required)" : "(optional)")
          }
        />
      </SelectTrigger>
      <SelectContent className="bg-secondary">
        <FlashList
          estimatedItemSize={40}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={field.options}
          renderItem={({ item }) => (
            <SelectItem value={item} label={item} className="text-primary" />
          )}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={SelectSeparator}
        />
      </SelectContent>
    </Select>
  );
}
