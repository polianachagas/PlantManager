import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';

export interface PlantsProps{

    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: string[],
    frequency: {
        times: number;
        repeat_every: string;
    },
    dateTimeNotification: Date;
    hour: string;
}

export interface EnviromentsProps{
    key:string;
    title:string;
}

export interface StoragePlantProps{
    [id: string]:{
        data: PlantsProps;
        notificationId: string;
    }
}

export async function savePlants(plant:PlantsProps):Promise<void> {
    let x
    try{
        const {times, repeat_every} = plant.frequency;
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();
        const startTime = new Date(String(now)); 
        const endTime = new Date(String(nextTime));
        const difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
        x= Math.round(difference / 60000);

        repeat_every ==='week' ? (
            x =((7*24)*60)+x
        ):(
            //  x=(24*60)+x
          x=x*60
        )
 
    
           console.log(x)
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Hey! 🌱',
                    body: `Está na hora de cuidar da sua ${plant.name}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        plant
                    },
                },
                trigger: {
                    seconds: x,
                }
            })

         
            
            
        
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps):{};
        const newPlant = {
            [plant.id]:{
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants',
            JSON.stringify({
                ...newPlant,
                ...oldPlants
            })
        );
    }catch(err){
        throw new Error(err);
    }
}

export async function loadPlants():Promise<PlantsProps[]> {
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data? (JSON.parse(data) as StoragePlantProps):{};
        
        const plantSorted = Object
        .keys(plants)
        .map((plant)=>{
            return{
                ...plants[plant].data,
                hour:format(new Date(plants[plant].data.dateTimeNotification),'HH:MM')
            }
        })
        .sort((a , b) => 
            Math.floor(
                new Date(a.dateTimeNotification).getTime()/1000
                - Math.floor(
                    new Date(b.dateTimeNotification).getTime()/1000
                )
            )
        )
        return plantSorted;
    }catch(err){
        throw new Error(err);
    }
}

export async function removePlant(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

    delete plants[id]

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}