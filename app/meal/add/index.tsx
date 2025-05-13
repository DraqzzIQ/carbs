import {Animated} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {Stack, useLocalSearchParams} from 'expo-router';

export default function SettingsScreen() {
    const params = useLocalSearchParams();
    const meal = params['mealName'] as string;
    const date = params['date'] as string;

    return (
        <ScrollView className='p-4 bg-secondary h-full'>
            <Stack.Screen
                options={{
                    title: `Add to ${meal}`
                }}
            />
        </ScrollView>
    );
}