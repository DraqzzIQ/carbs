import * as React from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'

type Props = {
    children: React.ReactNode
}

export const KeyboardShift = ({ children }: Props) => {
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