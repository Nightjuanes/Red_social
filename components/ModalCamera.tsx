import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { useCameraPermissions } from 'expo-image-picker';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export interface ModalCameraProps {
    isVisible: boolean,
    onClose: () => void,
    onSave: (photo: any) => void,
}

export default function ModalCamera({
    isVisible,
    onClose,
    onSave,
}: ModalCameraProps) {

    const [facing, setFacing] = useState<CameraType>('back');
    const cameraRef = useRef<any>()
    const [permission, requestPermission] = useCameraPermissions();

    const handleTakePhoto = async () => {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.5,
            base64: true
        });

        onSave(photo);
        onClose();

    }

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            onSave(result.assets[0]);
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            onDismiss={onClose}
        >
            {!permission ? <View /> :
                !permission.granted ?
                    <View style={styles.container}>
                        <Text style={styles.message}>Necesitas activar los permisos</Text>
                        <Button onPress={requestPermission} title="grant permission" />
                    </View>
                    :
                    <View style={styles.container}>
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing={facing}
                        >
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => setFacing(prev => prev == 'front' ? 'back' : 'front')}>
                                    <Ionicons name="refresh-circle" size={50} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                                    <MaterialCommunityIcons name="circle-slice-8" size={75} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handlePickImage}>
                                    <MaterialIcons name="cloud-circle" size={50} color="white" />
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    </View>
            }
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});