import {Animated, View} from 'react-native';
import * as React from 'react';
import {Text} from '~/components/ui/text';
import {Input} from '~/components/ui/input';
import {Switch} from '~/components/ui/switch';
import {useSettings} from '~/contexts/AppSettingsContext';
import {formatNumber} from '~/utils/util';
import ScrollView = Animated.ScrollView;
import {KeyboardShift} from '~/components/keyboard-shift';
import {CountryDropdown} from "~/components/country-dropdown";

export default function SettingsScreen() {
    const {
        maxCarbs, maxProtein, maxFat,
        maxBreakfast, maxLunch, maxDinner, maxSnacks,
        displaySnacks,
        setSettings
    } = useSettings();

    const totalMaxCalories =
        maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);

    return (
        <KeyboardShift>
            <ScrollView className='p-4 bg-secondary h-full' showsVerticalScrollIndicator={false}>
                <Text className='font-semibold text-lg text-center mt-2 text-primary'>
                    Total Calorie Budget: {formatNumber(totalMaxCalories)} kcal
                </Text>

                {[
                    {label: 'Breakfast', value: maxBreakfast, key: 'maxBreakfast'},
                    {label: 'Lunch', value: maxLunch, key: 'maxLunch'},
                    {label: 'Dinner', value: maxDinner, key: 'maxDinner'},
                ].map(({label, value, key}) => (
                    <View key={label} className='mt-3'>
                        <Text className='font-semibold text-sm'>{label} (kcal)</Text>
                        <Input
                            keyboardType='numeric'
                            value={value.toString()}
                            onChangeText={(text) => setSettings({[key]: Number(text) || 0})}
                            className='border border-primary p-2 rounded-md text-sm text-primary bg-secondary'
                        />
                    </View>
                ))}

                <View className='flex-row items-center justify-between mt-4'>
                    <Text className='font-semibold text-sm'>Include Snacks</Text>
                    <Switch checked={displaySnacks} onCheckedChange={(v) => setSettings({displaySnacks: v})}/>
                </View>

                <View className='mt-2'>
                    <Text className='font-semibold text-sm'>Snacks (kcal)</Text>
                    <Input
                        editable={displaySnacks}
                        keyboardType='numeric'
                        value={maxSnacks.toString()}
                        onChangeText={(text) => setSettings({maxSnacks: Number(text) || 0})}
                        className={`border border-primary p-2 rounded-md text-sm ${
                            displaySnacks
                                ? 'bg-secondary text-primary'
                                : 'bg-gray-200 dark:bg-gray-950 text-gray-400 dark:text-gray-500'
                        }`}
                    />
                </View>

                <Text className='font-semibold text-sm mt-6'>Macros</Text>
                {[
                    {label: 'Carbs', value: maxCarbs, key: 'maxCarbs'},
                    {label: 'Protein', value: maxProtein, key: 'maxProtein'},
                    {label: 'Fat', value: maxFat, key: 'maxFat'},
                ].map(({label, value, key}) => (
                    <View key={label} className='mt-2'>
                        <Text className='text-sm'>{label} (g)</Text>
                        <Input
                            keyboardType='numeric'
                            value={value.toString()}
                            onChangeText={(text) => setSettings({[key]: Number(text) || 0})}
                            className='border border-primary p-2 rounded-md text-sm text-primary bg-secondary'
                        />
                    </View>
                ))}
                <Text className='font-semibold text-sm mt-3'>Food Database</Text>
                <CountryDropdown/>
            </ScrollView>
        </KeyboardShift>
    );
}