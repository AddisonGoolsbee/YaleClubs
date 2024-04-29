
import { NativeWindStyleSheet } from 'nativewind';

import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams } from 'expo-router';

import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';
import {fetchClubs, fetchClubsAPI} from '../../../api/ManageClubs';
import SideBar from '../../../components/club/SideBar';
import ClubDescription from '../../../components/club/ClubDescription';
import AuthWrapper from '../../../components/AuthWrapper';
import DecoratorSVG from '../../../assets/decorator';
import Wrapper from '../../../components/Wrapper';


const ClubPage = () => {
    const { id } = useGlobalSearchParams();
    const [groupData, setGroupData] = useState([]);    

    // Native Wind SetUp
    NativeWindStyleSheet.setOutput({
        default: 'native',
    });

    // Fetch Clubs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetchClubs();
                setGroupData(resp);
            } catch (error) {
                console.error('Error fetching club data:', error);
            }
        };

        fetchData();
    }, [id]);
    
    return (
        <AuthWrapper>
            <SafeAreaView className="w-full">
                <View className="flex-col w-full min-h-screen">
                    <Header />
                    <View className="mb-10 w-full flex items-center">
                        <Wrapper>
                            <View className="absolute z-[-10] ph:hidden lg:flex h-[400] left-[-210] top-[-20]">
                                <DecoratorSVG />
                            </View>

                            <View className="w-full ph:flex-col-reverse lg:flex-row ph:px-5 lg:p-0">
                                <View className="w-full flex-shrink mr-10 ph:flex-col lg:flex-row">
                                    <View className="w-16 mr-5 ph:hidden lg:flex shadow-none">
                                        <Image className="h-16 w-16 rounded-full" source={{ uri: groupData?.logo }} />
                                    </View>

                                    <ClubDescription id={id} groupData={groupData} />
                                </View>

                                <SideBar
                                    data={{
                                        website: groupData?.website, 
                                        phone: groupData?.phone, 
                                        email: groupData?.email,
                                        identity: id
                                    }} 
                                />
                            </View>
                        </Wrapper>
                    </View>
                    <Footer />
                </View>
            </SafeAreaView>
        </AuthWrapper>
    );
}

export default ClubPage;
