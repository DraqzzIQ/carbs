import {Animated} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {KeyboardShift} from "~/components/keyboard-shift";
import {Stack, useLocalSearchParams} from 'expo-router';

export default function SettingsScreen() {
    const params = useLocalSearchParams();
    const title = params['mealName'];

    return (
        <KeyboardShift>
            <ScrollView className='p-4 bg-secondary h-full'>
                <Stack.Screen
                    options={{
                        title: `${title}`
                    }}
                />
            </ScrollView>
        </KeyboardShift>
    );
}