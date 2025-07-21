export default interface StatsCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: "increase" | "decrease" | string;
    };
    icon?: React.ReactNode;
}
