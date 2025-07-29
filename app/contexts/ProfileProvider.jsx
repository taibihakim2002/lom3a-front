"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import useApiRequest from '@/hooks/useApiRequest';
import globalApi from '@/utils/globalApi';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const { request, loading, data, error } = useApiRequest();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const result = await request(() => globalApi.getPublicProfile());
            if (result.success) {
                setProfile(result.data.data);
            }
        };
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, isLoading: loading }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
