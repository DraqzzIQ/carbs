import {ScrollView, View} from 'react-native';
import {Card} from '~/components/ui/card';
import {Text} from '~/components/ui/text';
import * as React from 'react';

type MealDetailProps = {}

export const MealDetails = ({}: MealDetailProps) => {
    return (
        <ScrollView className='h-full bg-secondary'>
            <Card className='p-3 bg-secondary'>
                <View className='flex-1 flex-row justify-between'>
                    <View>
                        <Text>
                            0 Kcal
                        </Text>
                        <Text className='text-xs'>
                            Calories
                        </Text>
                    </View>
                    <View>
                        <Text>
                            0.0 g
                        </Text>
                        <Text className='text-xs'>
                            Carbs
                        </Text>
                    </View>
                    <View>
                        <Text>
                            0.0 g
                        </Text>
                        <Text className='text-xs'>
                            Protein
                        </Text>
                    </View>
                    <View className='items-center'>
                        <Text className='font-semibold'>
                            0.0 g
                        </Text>
                        <Text className='text-xs'>
                            Fat
                        </Text>
                    </View>
                </View>
            </Card>
            <Card className='mt-7 p-3 bg-secondary'>

            </Card>
        </ScrollView>
    );
}