export const timeToMilliseconds = (timing: string): number => {

    const second: number = 1000;
    const minute: number = second * 60;
    
    switch (timing) {
        case "1 minute":
            return minute;
        case "2 minutes":
            return minute*2;
        case "3 minutes":
            return minute*3;
        case "5 minutes":
            return minute*5;
        case "10 minutes":
            return minute*10;
        case "15 minutes":
            return minute*15;
        case "30 minutes":
            return minute*30;
        case "1 hour":
            return minute*60;
        default:
            // Return 1 minute by default
            return minute;
    }

};