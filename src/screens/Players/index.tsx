import { useState, useEffect, useRef } from 'react';
import { FlatList, Alert, TextInput, Keyboard } from 'react-native'

import { Container , Form, HeaderList, NumberOfPlayers} from "./styles";
import { useRoute } from "@react-navigation/native";



import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroups } from "@storage/player/playersGetByGroups";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

type RouteParams = {
  group: string;
}

const newPlayerNameInputRef = useRef<TextInput>(null);

export function Players() {
  const [team, setTeam] = useState('Time A');
  const [newPlayerName, setNewPlayerName] = useState('')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const route = useRoute();

  const {group} = route.params as RouteParams;

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar')
    }
    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.focus();

      setNewPlayerName('');
      fetchPlayersByTeam();

    } catch (error) {
      if(error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log(error);

        Alert.alert('Nova pessoa', 'Não foi possivel adicionar')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
        const playersByTeam = await playersGetByGroupAndTeam(group, team);

        setPlayers(playersByTeam);

    } catch (error) {
      console.log(error);

      Alert.alert('Pessoas', 'Não foi possivel filtrar a pessoas do time')
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team])

  return (
    <Container>
        <Header showBackButton/>
        

        <Highlight
          title={group}
          subtitle="Adicione a galera e separe os times"
        />
        <Form>
        <Input
        inputRef={newPlayerNameInputRef}
        value={newPlayerName}
        onChangeText={setNewPlayerName}
        placeholder="Nome da Pessoa"
        autoCorrect={false}
        onSubmitEditing={handleAddPlayer}
        returnKeyType="done"
        /> 

        <ButtonIcon
        icon="add" 
        onPress={handleAddPlayer}
        />
        
        </Form>
        <HeaderList>
        <FlatList 
        data={['Time A', 'Time B']}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Filter
        title={item}
        isActive={item === team}
        onPress={() => setTeam(item)}
        />
        )}
        horizontal/>
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
        </HeaderList>

        <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <PlayerCard
          name={item.name}
          onRemove={() => {}}/>
        )}
        ListEmptyComponent={() => (<ListEmpty message="Não Há pessoas nesse time."/>)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {paddingBottom: 100 },
          players.length === 0 && {flex: 1}
        ]}
        />

        <Button
          title="Remover turma"
          type="SECUNDARY"
        />
       
    </Container>
  )
}