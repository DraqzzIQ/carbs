import {Animated, TouchableOpacity} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {MealDetails} from '~/components/index/meal/meal-details';
import {FloatingActionButton} from "~/components/floating-action-button";
import {PlusIcon} from "lucide-nativewind";

export default function MealScreen() {
    const params = useLocalSearchParams();
    const name = params['mealName'] as string;

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${name}`,
                }}
            />
            <ScrollView className='p-4 bg-secondary h-full'>
                <MealDetails/>
            </ScrollView>
            <FloatingActionButton onPress={() => router.push(`/meal/add?mealName=${name}&date=1`)}>
                <PlusIcon className='text-secondary h-9 w-9'/>
            </FloatingActionButton>
        </>
    );
}