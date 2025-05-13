import {Animated, TouchableOpacity} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {MealDetails} from "~/components/index/meals/meal-details";
import {PlusIcon} from "lucide-nativewind";

export default function MealScreen() {
    const params = useLocalSearchParams();
    const name = params['mealName'] as string;

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${name}`,
                    headerRight: () => (
                        <TouchableOpacity onPressIn={() => router.push(`/meal/add?mealName=${name}&date=1`)}>
                            <PlusIcon className='text-primary'/>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className='p-4 bg-secondary h-full'>
                <MealDetails/>
            </ScrollView>
        </>
    );
}