"use client";

import { useEffect, useState } from "react";
import { AccountService } from "@/services/account/account.service";

export function useAccount() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await AccountService.me();
            setProfile(res.data);
        } finally {
            setLoading(false);
        }
    };

    const update = async (payload: any) => {
        await AccountService.update(payload);
        await load();
    };

    useEffect(() => {
        load();
    }, []);

    return {
        profile,
        loading,
        reload: load,
        update,
    };
}
