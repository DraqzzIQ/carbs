import {Stack, useLocalSearchParams} from "expo-router";
import {ScrollView, View} from "react-native";
import {KeyboardShift} from "~/components/keyboard-shift";
import {Text} from "~/components/ui/text";

export default function AddToMealDetailsScreen() {
    const params = useLocalSearchParams();
    const meal = params['mealName'] as string;
    const date = params['date'] as string;
    const productId = params['productId'] as string;

    return (
        <KeyboardShift>
            <View className='p-4 bg-secondary h-full'>
                <Stack.Screen
                    options={{
                        title: `${meal}`,
                    }}
                />
            </View>
            <ScrollView>
                <Text>
                    {productId}
                </Text>
            </ScrollView>
        </KeyboardShift>
    );
}