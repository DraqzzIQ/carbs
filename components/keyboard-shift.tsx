import * as React from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'
import {useHeaderHeight} from '@react-navigation/elements'

type KeyboardShiftProps = {
    children: React.ReactNode
}

export const KeyboardShift = ({children}: KeyboardShiftProps) => {
    const height = useHeaderHeight()

    return (
        <KeyboardAvoidingView
            className='bg-secondary'
            keyboardVerticalOffset={height + 25}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled>
            {children}
        </KeyboardAvoidingView>
    )
}