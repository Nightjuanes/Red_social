import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet } from 'react-native';
import { DataContext } from '@/context/datacontext/DataContext'; // Asegúrate de que la ruta sea correcta
import ModalCamera from '@/components/ModalCamera'; // Modal para tomar/cargar la foto

const EditProfile = () => {
  const { state, updateUser } = useContext(DataContext);
  const { user } = state;

  const [Name, setUserName] = useState(user.userName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [currentPhoto, setCurrentPhoto] = useState(user.image || '');
  const [isVisible, setIsVisible] = useState(false);

  const handleUpdateProfile = async () => {
    await updateUser({
        name: Name,
        lastname: lastName,
        image: currentPhoto,
      });
      setCurrentPhoto(undefined);
      Alert.alert('Perfil actualizado', 'Los cambios han sido guardados correctamente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={Name}
        onChangeText={setUserName}
      />

      <Text style={styles.label}>Apellido:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Foto de perfil:</Text>
      {currentPhoto ? (
        <Image
          source={{ uri: currentPhoto }}
          style={styles.profileImage}
        />
      ) : (
        <Text style={styles.noPhotoText}>No se ha seleccionado una foto.</Text>
      )}

      <Button
        title="Cambiar Foto"
        onPress={() => setIsVisible(true)}
      />

      <Button
        title="Guardar Cambios"
        onPress={handleUpdateProfile}
      />

      <ModalCamera
        isVisible={isVisible}
        onSave={(photo) => {
          setCurrentPhoto(photo.uri); // Guarda la URI de la foto
          setIsVisible(false); // Cierra el modal después de guardar la foto
        }}
        onClose={() => setIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  noPhotoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
});

export default EditProfile;
