export function timeAgo(date: string | number | Date): string {
    const inputDate = new Date(date);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - inputDate.getTime());
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return `${seconds} seconds ago`;
}
