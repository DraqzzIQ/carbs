import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router';
import {
    CalendarIcon, CandyIcon, CoffeeIcon,
    FlameIcon, PlusIcon, SandwichIcon,
    SettingsIcon, UtensilsIcon,
} from 'lucide-nativewind';

import {Card} from '~/components/ui/card';
import {Progress} from '~/components/ui/progress';
import {Separator} from '~/components/ui/separator';
import {Text} from '~/components/ui/text';
import {formatNumber} from '~/util';
import {useSettings} from '~/contexts/AppSettingsContext';

export default function Screen() {
    const {
        maxCarbs, maxProtein, maxFat,
        maxBreakfast, maxLunch, maxDinner, maxSnacks,
        displaySnacks,
    } = useSettings();

    const [breakfast, setBreakfast] = React.useState(610);
    const [lunch, setLunch] = React.useState(10);
    const [dinner, setDinner] = React.useState(1000);
    const [snacks, setSnacks] = React.useState(9);

    const router = useRouter();

    const maxCalories = maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);
    const calories = breakfast + lunch + dinner + (displaySnacks ? snacks : 0);

    return (
        <View className='w-full items-center h-full bg-secondary'>
            <View className='flex-1 items-center p-5 text-primary w-full max-w-xl'>

                {/* Header */}
                <View className='flex-row w-full items-center'>
                    <Text className='text-xl font-semibold'>Today</Text>
                    <CalendarIcon className='text-primary ml-3'/>
                    <View className='grow'/>
                    <View className='flex-row mr-3 items-center'>
                        <FlameIcon className='text-primary'/>
                        <Text className='text-xl font-semibold text-primary'>17</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/settings')}>
                        <SettingsIcon className='text-primary'/>
                    </TouchableOpacity>
                </View>

                {/* Summary */}
                <View className='w-full'>
                    <Text className='font-semibold text-lg w-full mt-4'>Summary</Text>
                    <Card className='w-full gap-3 p-4 pb-14 rounded-2xl bg-secondary mt-1'>
                        <View className='items-center'>
                            <Text className='mb-1 font-semibold text-lg'>Calories</Text>
                            <Progress value={(calories / maxCalories) * 100}
                                      className='h-2 bg-gray-400 dark:bg-gray-600'/>
                            <Text className='font-semibold text-sm text-gray-500 dark:text-gray-300'>
                                {formatNumber(calories)} / {formatNumber(maxCalories)} kcal
                            </Text>
                        </View>
                        <View className='flex-row h-5 w-full'>
                            <MacroBar label="Carbs" consumed={200} max={maxCarbs}/>
                            <View className='grow'/>
                            <MacroBar label="Protein" consumed={78} max={maxProtein}/>
                            <View className='grow'/>
                            <MacroBar label="Fat" consumed={9} max={maxFat}/>
                        </View>
                    </Card>

                    {/* Meals */}
                    <Text className='font-semibold text-lg w-full mt-7'>Nutrition</Text>
                    <Card className='w-full gap-3 p-4 rounded-2xl bg-secondary mt-1'>
                        {[
                            {
                                icon: <CoffeeIcon className='mr-3 w-7 h-7 text-primary'/>,
                                name: "Breakfast",
                                consumed: breakfast,
                                max: maxBreakfast,
                            },
                            {
                                icon: <SandwichIcon className='mr-3 w-7 h-7 text-primary'/>,
                                name: "Lunch",
                                consumed: lunch,
                                max: maxLunch,
                            },
                            {
                                icon: <UtensilsIcon className='mr-3 w-7 h-7 text-primary'/>,
                                name: "Dinner",
                                consumed: dinner,
                                max: maxDinner,
                            },
                        ].map((meal, index, arr) => (
                            <React.Fragment key={meal.name}>
                                <MealBar {...meal} />
                                {(index < arr.length - 1 || displaySnacks) && <Separator />}
                            </React.Fragment>
                        ))}
                        {displaySnacks && (
                            <MealBar
                                icon={<CandyIcon className='mr-3 w-7 h-7 text-primary'/>}
                                name="Snacks"
                                consumed={snacks}
                                max={maxSnacks}
                            />
                        )}
                    </Card>
                </View>
            </View>
        </View>
    );
}

function MacroBar({label, consumed, max}: { label: string, consumed: number, max: number }) {
    return (
        <View className='h-7 w-1/4 items-center'>
            <Text className='mb-1 font-semibold'>{label}</Text>
            <Progress value={(consumed / max) * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
            <Text className='font-semibold text-gray-500 dark:text-gray-300 text-xs'>
                {consumed} / {max} g
            </Text>
        </View>
    );
}

function MealBar({
                     icon, name, consumed, max,
                 }: {
    icon: React.ReactNode, name: string, consumed: number, max: number
}) {
    return (
        <View className='flex-row items-center'>
            {icon}
            <View className='items-center w-2/3'>
                <Text className='mb-1 font-semibold w-full'>{name}</Text>
                <Progress value={(consumed / max) * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                <Text className='text-xs text-gray-500 dark:text-gray-300 font-semibold w-full'>
                    {consumed} / {max} kcal
                </Text>
            </View>
            <View className='grow'/>
            <PlusIcon className='h-7 w-7 text-primary'/>
        </View>
    );
}