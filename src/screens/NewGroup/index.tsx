import { Container, Content, Icon} from "./styles";
import { useState } from "react";
import {Alert} from 'react-native';
import { Header } from "@components/Header";
import { useNavigation } from "@react-navigation/native";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { AppError } from "@utils/AppError";

import { groupCreate } from "@storage/group/groupCreate";

export function NewGroup() {

  const [group, SetGroup] = useState('')
   const navigation = useNavigation()

  async function handleNew() {

    try {

      if (group.trim().length === 0) {
        return Alert.alert('Novo Grupo', 'Informe o nome da turma');
      } 

      
      await groupCreate(group);

    
      navigation.navigate('players', {group})
    } catch (error) {
      if(error instanceof AppError) {
        Alert.alert('Novo grupo', error.message)
      } else {
        Alert.alert('Novo grupo', 'Não foi possivel criar um novo grupo.')
      }
      
    }

  }
  return (
    <Container>
        <Header showBackButton/>
        <Content>
            <Icon/>
            <Highlight 
            title="Nova turma"
            subtitle="Crie a turma para adicionar as pessoas"/>
            <Input
            placeholder="Nome da Turma"
            onChangeText={SetGroup}/>
            <Button 
            title="Criar"
            style={{marginTop: 20}}
            onPress={handleNew}/>
        </Content>
    </Container>
  )
}