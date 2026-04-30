import { useEffect, useState } from 'react';

type GoldPoint = {
  time: string;
  price: number;
};

export const useGoldPrice = () => {
  const [data, setData] = useState<GoldPoint[]>([]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          'https://api.metals.live/v1/spot/gold'
        );

        const json = await res.json();

        // API can return different formats
        const price =
          json?.[0]?.price ||
          json?.[0]?.[1] ||
          2300;

        const time = new Date().toLocaleTimeString();

        setData((prev) => {
          const updated = [
            ...prev.slice(-20),
            { time, price },
          ];
          return updated;
        });
      } catch (err) {
        console.error(err);
      }
    };

    // 🔥 INITIAL FAKE DATA (so chart not empty)
    const base = 2300;
    const fake = Array.from({ length: 20 }).map((_, i) => ({
      time: `${i}`,
      price: base + Math.sin(i / 3) * 20 + i * 2,
    }));

    setData(fake);

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  return data;
};