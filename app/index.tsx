import * as React from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import {Card} from '~/components/ui/card';
import {Progress} from '~/components/ui/progress';
import {Text} from '~/components/ui/text';
import {Switch} from '~/components/ui/switch';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet'
import {
    CalendarIcon,
    CandyIcon,
    CoffeeIcon,
    FlameIcon,
    PlusIcon,
    SandwichIcon,
    SettingsIcon,
    UtensilsIcon
} from 'lucide-nativewind';
import {Separator} from '~/components/ui/separator';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function Screen() {
    const [maxCarbs, setMaxCarbs] = React.useState(250);
    const [maxProtein, setMaxProtein] = React.useState(150);
    const [maxFat, setMaxFat] = React.useState(70);

    const [maxBreakfast, setMaxBreakfast] = React.useState(600);
    const [maxLunch, setMaxLunch] = React.useState(700);
    const [maxDinner, setMaxDinner] = React.useState(500);
    const [maxSnacks, setMaxSnacks] = React.useState(200);

    const [breakfast, setBreakfast] = React.useState(610);
    const [lunch, setLunch] = React.useState(10);
    const [dinner, setDinner] = React.useState(1000);
    const [snacks, setSnacks] = React.useState(9);

    const [displaySnacks, setDisplaySnacks] = React.useState(true);

    const totalMaxCalories = React.useMemo(() => {
        let total = maxBreakfast + maxLunch + maxDinner;
        if (displaySnacks) total += maxSnacks;
        return total;
    }, [maxBreakfast, maxLunch, maxDinner, maxSnacks, displaySnacks]);

    const maxCalories = maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);
    const calories = breakfast + lunch + dinner + (displaySnacks ? snacks : 0);

    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const handleSettingsPress = () => bottomSheetRef.current?.expand();

    return (
        <View className='h-full'>
            <View className='h-6'/>
            <GestureHandlerRootView className="bg-secondary">
                <View className='w-full items-center bg-secondary h-full'>
                    <View className='flex-1 items-center p-5 bg-secondary text-primary w-full max-w-xl'>
                        {/* Header */}
                        <View className='flex-row w-full items-center'>
                            <Text className='text-xl font-semibold'>Today</Text>
                            <CalendarIcon className='text-primary ml-3'/>
                            <View className='grow'/>
                            <View className='flex-row mr-3 items-center'>
                                <FlameIcon className='text-primary'/>
                                <Text className='text-xl font-semibold text-primary'>17</Text>
                            </View>
                            <TouchableOpacity onPress={handleSettingsPress}>
                                <SettingsIcon className='text-primary'/>
                            </TouchableOpacity>
                        </View>

                        {/* Summary */}
                        <View className='w-full'>
                            <Text className='font-semibold text-lg w-full mt-4'>Summary</Text>
                            <Card className='w-full gap-3 p-4 pb-14 rounded-2xl bg-secondary mt-1'>
                                <View className='items-center'>
                                    <Text className='mb-1 font-semibold text-lg'>Calories</Text>
                                    <Progress value={calories / maxCalories * 100}
                                              className='h-2 bg-gray-400 dark:bg-gray-600'/>
                                    <Text
                                        className='font-semibold text-sm text-gray-500 dark:text-gray-300'>{formatNumber(calories)} / {formatNumber(maxCalories)} kcal</Text>
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
                                        max: maxBreakfast
                                    },
                                    {
                                        icon: <SandwichIcon className='mr-3 w-7 h-7 text-primary'/>,
                                        name: "Lunch",
                                        consumed: lunch,
                                        max: maxLunch
                                    },
                                    {
                                        icon: <UtensilsIcon className='mr-3 w-7 h-7 text-primary'/>,
                                        name: "Dinner",
                                        consumed: dinner,
                                        max: maxDinner
                                    },
                                ].map((meal) => (
                                    <React.Fragment key={meal.name}>
                                        <MealBar {...meal} />
                                        <Separator/>
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

                    {/* Bottom Sheet Settings */}
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={-1}
                        snapPoints={['100%']}
                        enablePanDownToClose={true}
                        enableDynamicSizing={false}
                        keyboardBehavior="interactive"
                        onClose={() => Keyboard.dismiss()}
                    >
                        <BottomSheetView className='bg-secondary'>
                            <View className='p-4'>
                                <Text className='text-lg font-semibold mb-4'>Settings</Text>
                                <Text className='font-semibold text-md text-center mt-2 text-primary'>
                                    Total Calorie Budget: {formatNumber(totalMaxCalories)} kcal
                                </Text>
                                {[
                                    {label: "Breakfast", value: maxBreakfast, setter: setMaxBreakfast},
                                    {label: "Lunch", value: maxLunch, setter: setMaxLunch},
                                    {label: "Dinner", value: maxDinner, setter: setMaxDinner}
                                ].map(({label, value, setter}) => (
                                    <View key={label} className='mt-3'>
                                        <Text className='font-semibold text-sm'>{label}</Text>
                                        <BottomSheetTextInput
                                            keyboardType="numeric"
                                            value={value.toString()}
                                            onChangeText={(text) => setter(Number(text) || 0)}
                                            className='border border-primary p-2 rounded-md text-sm text-primary bg-secondary'
                                        />
                                    </View>
                                ))}

                                <View className='flex-row items-center justify-between mt-4'>
                                    <Text className='font-semibold text-sm'>Include Snacks</Text>
                                    <Switch checked={displaySnacks} onCheckedChange={setDisplaySnacks}/>
                                </View>

                                <View className='mt-2'>
                                    <Text className='font-semibold text-sm'>Snacks</Text>
                                    <BottomSheetTextInput
                                        editable={displaySnacks}
                                        keyboardType="numeric"
                                        value={maxSnacks.toString()}
                                        onChangeText={(text) => setMaxSnacks(Number(text) || 0)}
                                        className={`border border-primary p-2 rounded-md text-sm text-primary ${
                                            displaySnacks ? 'bg-secondary' : 'bg-gray-200 dark:bg-gray-950 text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                </View>

                                {/* Macros */}
                                <Text className='font-semibold text-sm mt-6'>Macros</Text>
                                {[
                                    {label: "Carbs", value: maxCarbs, setter: setMaxCarbs},
                                    {label: "Protein", value: maxProtein, setter: setMaxProtein},
                                    {label: "Fat", value: maxFat, setter: setMaxFat}
                                ].map(({label, value, setter}) => (
                                    <View key={label} className='mt-2'>
                                        <Text className='text-sm'>{label}</Text>
                                        <BottomSheetTextInput
                                            keyboardType="numeric"
                                            value={value.toString()}
                                            onChangeText={(text) => setter(Number(text) || 0)}
                                            className='border border-primary p-2 rounded-md text-sm text-primary bg-secondary'
                                        />
                                    </View>
                                ))}
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            </GestureHandlerRootView>
        </View>
    );
}

// Shared subcomponents
function formatNumber(num: number): string {
    return num > 999 ? num.toLocaleString('de-DE') : num.toString();
}

function MacroBar({label, consumed, max}: { label: string, consumed: number, max: number }) {
    return (
        <View className='h-7 w-1/4 items-center'>
            <Text className='mb-1 font-semibold'>{label}</Text>
            <Progress value={consumed / max * 100}
                      className='h-2 bg-gray-400 dark:bg-gray-600'/>
            <Text className='font-semibold text-gray-500 dark:text-gray-300 text-xs'>{consumed} / {max} g</Text>
        </View>
    );
}

function MealBar({icon, name, consumed, max}: { icon: React.ReactNode, name: string, consumed: number, max: number }) {
    return (
        <View className='flex-row items-center'>
            {icon}
            <View className='items-center w-2/3'>
                <Text className='mb-1 font-semibold w-full'>{name}</Text>
                <Progress value={consumed / max * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                <Text
                    className='text-xs text-gray-500 dark:text-gray-300 font-semibold w-full'>{consumed} / {max} kcal</Text>
            </View>
            <View className='grow'/>
            <PlusIcon className='h-7 w-7 cursor-pointer text-primary'/>
        </View>
    );
}