import * as React from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'

type KeyboardShiftProps = {
    children: React.ReactNode
}

export const KeyboardShift = ({ children }: KeyboardShiftProps) => {
    const height = useHeaderHeight()

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={height + 50}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            enabled>
            {children}
        </KeyboardAvoidingView>
    )
}