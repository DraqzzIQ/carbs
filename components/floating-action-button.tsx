import {TouchableOpacity, View} from "react-native";
import * as React from "react";

type FloatingActionButtonProps = {
    children?: React.ReactNode;
    onPress: () => void;
}

export const FloatingActionButton = ({children, onPress}: FloatingActionButtonProps) => {
    return (
        <View
            className='bg-primary rounded-full h-14 w-14 absolute bottom-8 right-4 items-center justify-center'>
            <TouchableOpacity onPressIn={() => onPress()}>
                {children}
            </TouchableOpacity>
        </View>
    );
}