import { useEffect, useState } from 'react';

const useFetchData = (url, refreshKey = 0) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                
                const res = await fetch(url, {
                    headers: { 
                        Authorization: token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message || 'Failed to fetch');
                }

                setData(result.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, refreshKey]);

    return { data, loading, error };
};

export default useFetchData;
