import { MagicMaticClient } from './magic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type UserHandler = {
    user?: any;
    login: any;
    logout: any;
    loading: boolean;
};

export default function useUser(): UserHandler {
    const router = useRouter();
    const [user, setUser] = useState<any>('');
    const [loading, setLoading] = useState(true);

    async function login(email: string) {
        const loginDid = await MagicMaticClient?.auth.loginWithMagicLink({ email });
        if (!loginDid) {
            console.error('failed to login !loginMeta');
            return;
        }

        const userMeta = await MagicMaticClient?.user.getMetadata();
        if (!userMeta) {
            console.error('failed to login !userMeta');
            return;
        }

        console.log({ userMeta, loginDid });
        setUser(userMeta);
    }

    async function logout() {
        await MagicMaticClient?.user.logout();
        setUser(null);
        router.push('/');
    }

    useEffect(() => {
        if (!user) {
            (async () => {
                const isLoggedIn = await MagicMaticClient?.user.isLoggedIn();
                console.log('magic user is loggedIn', isLoggedIn);
                if (isLoggedIn) {
                    try {
                        const userMeta = await MagicMaticClient?.user.getMetadata();
                        console.log(userMeta);
                        setUser(userMeta);
                    } catch (err) {
                        console.error('failed to check magic user', err);
                    }
                }
                setLoading(false);
            })();
        } else if (loading) {
            setLoading(false);
        }
    }, [user, loading]);

    return { user, login, logout, loading };
}
