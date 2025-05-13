import * as React from 'react';
import {View} from 'react-native';
import {useSettings} from '~/contexts/AppSettingsContext';
import {Header} from "~/components/index/header";
import {Summary} from "~/components/index/summary";
import {Meals} from "~/components/index/meals";

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

    const maxCalories = maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);
    const calories = breakfast + lunch + dinner + (displaySnacks ? snacks : 0);

    return (
        <View className='w-full items-center h-full bg-secondary'>
            <View className='flex-1 items-center p-4 text-primary w-full max-w-xl'>

                <Header/>

                <View className='w-full'>
                    <Summary calories={calories}
                             maxCalories={maxCalories}
                             maxCarbs={maxCarbs}
                             maxProtein={maxProtein}
                             maxFat={maxFat}/>

                    <Meals breakfast={breakfast}
                           maxBreakfast={maxBreakfast}
                           lunch={lunch}
                           maxLunch={maxLunch}
                           dinner={dinner}
                           maxDinner={maxDinner}
                           snacks={snacks}
                           maxSnacks={maxSnacks}
                           displaySnacks={displaySnacks}/>
                </View>
            </View>
        </View>
    );
}