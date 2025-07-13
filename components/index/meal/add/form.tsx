import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
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
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
}

type Field = {
  key: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  options?: string[];
  type: FieldType;
  className?: string;
};

type FieldOrRow = Field | Field[];

export type FormCategory = {
  category: string;
  fields: FieldOrRow[];
  defaultVisible: number;
  className?: string;
};

type FoodFormProps = {
  formConfig: FormCategory[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  edit?: boolean;
};

export function Form({ formConfig, onSubmit, edit = false }: FoodFormProps) {
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
    <View className="flex-1">
      {formConfig.map((cat, idx) => {
        const visibleCount = showMore[cat.category]
          ? cat.fields.length
          : cat.defaultVisible;
        return (
          <View key={idx} className={cn("mb-6", cat.className)}>
            {cat.category !== "" && (
              <Text className="font-medium text-lg">{cat.category}</Text>
            )}
            {cat.fields.slice(0, visibleCount).map((item, idx) =>
              Array.isArray(item) ? (
                <View key={idx} className="flex-row gap-2 mb-2">
                  {item.map((field) => (
                    <View
                      key={field.key}
                      className={cn("flex-1", field.className)}
                    >
                      {field.type === FieldType.Text ? (
                        <TextField
                          field={field}
                          value={form[field.key]}
                          onChange={(v: string) => handleChange(field.key, v)}
                          onBlur={() => handleBlur(field.key)}
                          error={errors[field.key]}
                          touched={touched[field.key]}
                        />
                      ) : field.type === FieldType.Number ? (
                        <NumberField
                          field={field}
                          value={form[field.key]}
                          onChange={(v: string) => handleChange(field.key, v)}
                          onBlur={() => handleBlur(field.key)}
                          error={errors[field.key]}
                          touched={touched[field.key]}
                        />
                      ) : (
                        <SelectField
                          field={field}
                          value={form[field.key]}
                          onChange={(v: string) => handleChange(field.key, v)}
                          onBlur={() => handleBlur(field.key)}
                          error={errors[field.key]}
                          touched={touched[field.key]}
                        />
                      )}
                      {field.required &&
                        touched[field.key] &&
                        errors[field.key] && (
                          <Text className="text-red-500 text-xs mt-1">
                            {errors[field.key]}
                          </Text>
                        )}
                    </View>
                  ))}
                </View>
              ) : (
                <View key={item.key} className={cn("mb-2", item.className)}>
                  {item.type === FieldType.Text ? (
                    <TextField
                      field={item}
                      value={form[item.key]}
                      onChange={(v: string) => handleChange(item.key, v)}
                      onBlur={() => handleBlur(item.key)}
                      error={errors[item.key]}
                      touched={touched[item.key]}
                    />
                  ) : item.type === FieldType.Number ? (
                    <NumberField
                      field={item}
                      value={form[item.key]}
                      onChange={(v: string) => handleChange(item.key, v)}
                      onBlur={() => handleBlur(item.key)}
                      error={errors[item.key]}
                      touched={touched[item.key]}
                    />
                  ) : (
                    <SelectField
                      field={item}
                      value={form[item.key]}
                      onChange={(v: string) => handleChange(item.key, v)}
                      onBlur={() => handleBlur(item.key)}
                      error={errors[item.key]}
                      touched={touched[item.key]}
                    />
                  )}
                  {item.required && touched[item.key] && errors[item.key] && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors[item.key]}
                    </Text>
                  )}
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
          </View>
        );
      })}
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

function TextField({ field, value, onChange, onBlur, error, touched }: any) {
  return (
    <Input
      placeholder={field.label}
      value={value ?? ""}
      onChangeText={onChange}
      onBlur={onBlur}
      className={`${field.required && touched && error ? "border-red-500" : ""}`}
    />
  );
}

function NumberField({ field, value, onChange, onBlur, error, touched }: any) {
  return (
    <NumericInput
      allowDecimal={field.allowDecimal ?? false}
      allowNegative={field.allowNegative ?? false}
      placeholder={field.label}
      defaultValue={value ?? ""}
      onValueChange={onChange}
      onBlur={onBlur}
      className={`${field.required && touched && error ? "border-red-500" : ""}`}
    />
  );
}

function SelectField({ field, value, onChange, onBlur, error, touched }: any) {
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
        <SelectValue className="text-primary" placeholder={field.label} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option: string) => (
          <SelectItem key={option} value={option} label={option} />
        ))}
      </SelectContent>
    </Select>
  );
}
