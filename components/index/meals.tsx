import {Text} from '~/components/ui/text';
import {Card} from '~/components/ui/card';
import {CandyIcon, CoffeeIcon, PlusIcon, SandwichIcon, UtensilsIcon} from 'lucide-nativewind';
import * as React from 'react';
import {Separator} from '~/components/ui/separator';
import {TouchableOpacity, View} from 'react-native';
import {Progress} from '~/components/ui/progress';
import {formatNumber} from '~/utils/util';
import {router} from 'expo-router';

type MealsProps = {
    breakfast: number;
    maxBreakfast: number;
    lunch: number;
    maxLunch: number;
    dinner: number;
    maxDinner: number;
    snacks: number;
    maxSnacks: number;
    displaySnacks: boolean;
}

export const Meals = ({
                          breakfast,
                          maxBreakfast,
                          lunch,
                          maxLunch,
                          dinner,
                          maxDinner,
                          snacks,
                          maxSnacks,
                          displaySnacks
                      }: MealsProps) => {
    return (
        <>
            <Text className='font-semibold text-lg w-full mt-7'>Nutrition</Text>
            <Card className='w-full gap-3 p-4 rounded-2xl bg-secondary mt-1'>
                {[
                    {
                        icon: <CoffeeIcon className='mr-3 w-7 h-7 text-primary'/>,
                        name: 'Breakfast',
                        consumed: breakfast,
                        max: maxBreakfast,
                    },
                    {
                        icon: <SandwichIcon className='mr-3 w-7 h-7 text-primary'/>,
                        name: 'Lunch',
                        consumed: lunch,
                        max: maxLunch,
                    },
                    {
                        icon: <UtensilsIcon className='mr-3 w-7 h-7 text-primary'/>,
                        name: 'Dinner',
                        consumed: dinner,
                        max: maxDinner,
                    },
                ].map((meal, index, arr) => (
                    <React.Fragment key={meal.name}>
                        <MealBar {...meal} />
                        {(index < arr.length - 1 || displaySnacks) && <Separator/>}
                    </React.Fragment>
                ))}
                {displaySnacks && (
                    <MealBar
                        icon={<CandyIcon className='mr-3 w-7 h-7 text-primary'/>}
                        name='Snacks'
                        consumed={snacks}
                        max={maxSnacks}
                    />
                )}
            </Card>
        </>
    );
}


function MealBar({
                     icon, name, consumed, max,
                 }: {
    icon: React.ReactNode, name: string, consumed: number, max: number
}) {
    return (
        <TouchableOpacity onPress={() => router.push(`/meal?mealName=${name}`)}>
            <View className='flex-row items-center'>
                {icon}
                <View className='items-center w-2/3'>
                    <Text className='mb-1 font-semibold w-full'>{name}</Text>
                    <Progress value={(consumed / max) * 100} className='h-2 bg-gray-400 dark:bg-gray-600'/>
                    <Text className='text-xs text-gray-500 dark:text-gray-300 font-semibold w-full'>
                        {consumed} / {max} kcal ({formatNumber(consumed / max * 100)}%)
                    </Text>
                </View>
                <View className='grow'/>
                <TouchableOpacity onPress={() => router.push(`/meal/add?mealName=${name}&date=1`)}>
                    <View className='w-10 h-10 items-center justify-center'>
                        <PlusIcon className='h-7 w-7 text-primary'/>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}