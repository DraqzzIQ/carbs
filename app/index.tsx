import * as React from 'react';
import {View} from 'react-native';
import {Card} from '~/components/ui/card';
import {Progress} from '~/components/ui/progress';
import {Text} from '~/components/ui/text';
import {CalendarIcon, FlameIcon, PlusIcon} from "lucide-react-native";


export default function Screen() {
    const [maxCalories, setMaxCalories] = React.useState(2000);
    const [maxCarbs, setMaxCarbs] = React.useState(250);
    const [maxProtein, setMaxProtein] = React.useState(150);
    const [maxFat, setMaxFat] = React.useState(11);
    const [calories, setCalories] = React.useState(1221);
    const [carbs, setCarbs] = React.useState(200);
    const [protein, setProtein] = React.useState(78);
    const [fat, setFat] = React.useState(9);
    const [maxBreakfast, setMaxBreakfast] = React.useState(600);
    const [maxLunch, setMaxLunch] = React.useState(700);
    const [maxDinner, setMaxDinner] = React.useState(500);
    const [maxSnacks, setMaxSnacks] = React.useState(200);
    const [breakfast, setBreakfast] = React.useState(610);
    const [lunch, setLunch] = React.useState(10);
    const [dinner, setDinner] = React.useState(1000);
    const [snacks, setSnacks] = React.useState(9);


    return (
        <View className='flex-1 items-center p-3 pt-5 bg-secondary text-primary'>
            <View className='flex-row w-full space-x-3'>
                <Text className='text-xl font-semibold'>Today</Text>
                <div className='grow'/>
                <View className='flex-row'>
                    <FlameIcon/>
                    <Text className='text-l font-semibold text-primary'>17</Text>
                </View>
                <CalendarIcon/>
            </View>
            <Text className='font-semibold text-lg w-full mt-4'>Summary</Text>
            <Card className='w-full max-w-sm gap-3 p-4 rounded-2xl bg-secondary pb-14 mt-1'>
                <View className='items-center'>
                    <Text className='mb-1 font-semibold text-lg'>Calories</Text>
                    <Progress value={calories / maxCalories * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                    <Text
                        className='font-semibold text-gray-500 dark:text-gray-300 text-sm'>{formatNumber(calories)} / {formatNumber(maxCalories)} g</Text>
                </View>
                <View className='flex-row h-5 w-full'>
                    <View className='h-2 w-1/4 items-center'>
                        <Text className='mb-1 font-semibold'>Carbs</Text>
                        <Progress value={carbs / maxCarbs * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs'>{carbs} / {maxCarbs} g</Text>
                    </View>
                    <div className='grow'/>
                    <View className='h-2 w-1/4 items-center'>
                        <Text className='mb-1 font-semibold'>Protein</Text>
                        <Progress value={protein / maxProtein * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs'>{protein} / {maxProtein} g</Text>
                    </View>
                    <div className="grow"/>
                    <View className='h-2 w-1/4 items-center'>
                        <Text className='mb-1 font-semibold'>Fat</Text>
                        <Progress value={fat / maxFat * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs'>{fat} / {maxFat} g</Text>
                    </View>
                </View>
            </Card>
            <Text className='font-semibold text-lg w-full mt-7'>Nutrition</Text>
            <Card className='w-full max-w-sm gap-3 p-4 rounded-2xl bg-secondary pb-6 mt-1'>
                <View className='flex-row items-center'>
                    <View className='items-center w-4/5'>
                        <Text className='mb-1 font-semibold w-full'>Breakfast</Text>
                        <Progress value={breakfast / maxBreakfast * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs w-full'>{formatNumber(breakfast)} / {formatNumber(maxBreakfast)} kcal</Text>
                    </View>
                    <div className='grow'/>
                    <PlusIcon className='h-5 w-5 cursor-pointer text-primary'/>
                </View>
                <View className='flex-row items-center'>
                    <View className='items-center w-4/5'>
                        <Text className='mb-1 font-semibold w-full'>Lunch</Text>
                        <Progress value={lunch / maxLunch * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs w-full'>{formatNumber(lunch)} / {formatNumber(maxLunch)} kcal</Text>
                    </View>
                    <div className='grow'/>
                    <PlusIcon className='h-5 w-5 cursor-pointer text-primary'/>
                </View>
                <View className='flex-row items-center'>
                    <View className='items-center w-4/5'>
                        <Text className='mb-1 font-semibold w-full'>Dinner</Text>
                        <Progress value={dinner / maxDinner * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs w-full'>{formatNumber(dinner)} / {formatNumber(maxDinner)} kcal</Text>
                    </View>
                    <div className='grow'/>
                    <PlusIcon className='h-5 w-5 cursor-pointer text-primary'/>
                </View>
                <View className='flex-row items-center'>
                    <View className='items-center w-4/5'>
                        <Text className='mb-1 font-semibold w-full'>Snacks</Text>
                        <Progress value={snacks / maxSnacks * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                        <Text
                            className='font-semibold text-gray-500 dark:text-gray-300 text-xs w-full'>{formatNumber(snacks)} / {formatNumber(maxSnacks)} kcal</Text>
                    </View>
                    <div className='grow'/>
                    <PlusIcon className='h-5 w-5 cursor-pointer text-primary'/>
                </View>
            </Card>
        </View>
    );
}

function formatNumber(num: number): string {
    return num > 999 ? num.toLocaleString('de-DE') : num.toString();
}