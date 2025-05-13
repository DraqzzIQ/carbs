import {Text} from "~/components/ui/text";
import {Card} from "~/components/ui/card";
import {View} from "react-native";
import {Progress} from "~/components/ui/progress";
import {formatNumber, formatPercentage} from "~/utils/util";
import * as React from "react";

type SummaryProps = {
    calories: number,
    maxCalories: number,
    maxCarbs: number,
    maxProtein: number,
    maxFat: number
}

export const Summary = ({calories, maxCalories, maxCarbs, maxProtein, maxFat}: SummaryProps) => {
    return (
        <>
            <Text className='font-semibold text-lg w-full mt-4'>Summary</Text>
            <Card className='w-full gap-3 p-4 pb-14 rounded-2xl bg-secondary mt-1'>
                <View className='items-center'>
                    <Text className='mb-1 font-semibold text-lg'>Calories</Text>
                    <Progress value={(calories / maxCalories) * 100}
                              className='h-2 bg-gray-400 dark:bg-gray-600'/>
                    <Text className='font-semibold text-sm text-gray-500 dark:text-gray-300'>
                        {formatNumber(calories)} / {formatNumber(maxCalories)} kcal
                        ({formatPercentage(calories / maxCalories * 100)}%)
                    </Text>
                </View>
                <View className='flex-row h-6 w-full'>
                    <MacroBar label="Carbs" consumed={200} max={maxCarbs}/>
                    <View className='grow'/>
                    <MacroBar label="Protein" consumed={78} max={maxProtein}/>
                    <View className='grow'/>
                    <MacroBar label="Fat" consumed={9} max={maxFat}/>
                </View>
            </Card>
        </>
    );
}

function MacroBar({label, consumed, max}: { label: string, consumed: number, max: number }) {
    return (
        <View className='h-8 w-1/4 items-center'>
            <Text className='mb-1 font-semibold'>{label}</Text>
            <Progress value={(consumed / max) * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
            <Text className='font-semibold text-gray-500 dark:text-gray-300 text-xs text-center'>
                {consumed} / {max} g
            </Text>
            <Text className='font-semibold text-gray-500 dark:text-gray-300 text-xs text-center'>
                ({formatPercentage(consumed / max * 100)}%)
            </Text>
        </View>
    );
}