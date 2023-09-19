import React, { useState } from 'react';
import { SafeAreaView, 
        StyleSheet, 
        Text, 
        View,
        TextInput,
        KeyboardAvoidingView,
        TouchableWithoutFeedback, 
        Platform,
        Alert,
        TouchableOpacityComponent,
        Keyboard} from 'react-native';
import { useNavigation } from '@react-navigation/core'
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserIdentification() {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>();
    const navigation = useNavigation();

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!name);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputChange(value: string) {
        setName(value);
        setIsFocused(!!value);
    }

    async function handleSubmit() {
        if (!name)
            return Alert.alert('Me diga como posso te chamar 🥺');       
        try {
            await AsyncStorage.setItem('@plantmanager:user', name); 
            Alert.alert('Seu nome foi salvo com sucesso 😄')
            navigation.navigate('Confirmation', {
                                title: 'Prontinho',
                                subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado',
                                buttonTitle: 'Começar',
                                icon: 'smile',
                                nextScreen: 'PlantSelect' //plantselected
            });
        } catch { 
 
            Alert.alert('Não foi possível salvar o seu nome 🥺')
        }
               
    }

    return (
        <SafeAreaView style = {styles.container}>
            <KeyboardAvoidingView style = {styles.container}
                                    behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress = { Keyboard.dismiss }>
                    <View style = {styles.content}>
                        <View style = {styles.form}>
                            <View style = {styles.header}>
                                <Text style = {styles.emoji}>
                                    { isFilled ? '😄' : '😀'}
                                </Text>

                                <Text style = {styles.title}>
                                    Como podemos {'\n'}
                                    chamar você?
                                </Text>
                            </View>

                            <TextInput style = {[styles.input, 
                                                (isFocused || isFilled) && { borderColor: colors.green }]}
                                                placeholder = "Digite seu nome"
                                                onBlur = {handleInputBlur}
                                                onFocus = {handleInputFocus}
                                                onChangeText = {handleInputChange}/>
                        
                            <View style = {styles.footer}>
                                <Button title = "Confirmar"
                                onPress = {handleSubmit}/>
                            </View>
                        </View>
                        
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>  
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    content: {
        flex: 1,
        width: '100%'
    },

    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center'
    },

    emoji: {
        fontSize: 44
    },

    input: {
        borderBottomWidth: 1, //espessura da borda
        borderColor: colors.gray, //cor da borda
        color: colors.heading,
        width: '100%', //tamanho da borda
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    }, 
    
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },

    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20
    },

    header: {
        alignItems: 'center'
    }
});