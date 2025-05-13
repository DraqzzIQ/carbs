import {CalendarIcon, FlameIcon, SettingsIcon} from 'lucide-nativewind';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/ui/text';
import {router} from 'expo-router';

export const Header = () => {
    return (
        <View className='flex-row w-full items-center'>
            <Text className='text-xl font-semibold'>Today</Text>
            <CalendarIcon className='text-primary ml-3'/>
            <View className='grow'/>
            <View className='flex-row mr-3 items-center'>
                <FlameIcon className='text-primary'/>
                <Text className='text-xl font-semibold text-primary'>17</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')}>
                <View className='w-10 h-10 items-center justify-center'>
                    <SettingsIcon className='text-primary'/>
                </View>
            </TouchableOpacity>
        </View>
    );
}