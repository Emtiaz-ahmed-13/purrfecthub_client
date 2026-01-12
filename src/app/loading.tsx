export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="text-center">
                {/* Animated Logo/Icon */}
                <div className="relative mb-8">
                    <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center animate-pulse">
                        <div className="text-4xl">🐱</div>
                    </div>
                    <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-gradient-to-r from-primary to-pink-500 blur-xl opacity-50 animate-pulse"></div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-foreground mb-2">Loading...</h2>
                <p className="text-muted-foreground">লোড হচ্ছে...</p>

                {/* Loading Spinner */}
                <div className="mt-8 flex justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
