"use client";

import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div
            className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                }`}
        >
            {children}
        </div>
    );
}
