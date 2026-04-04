export const formatDate = (date: string | Date | number, format = "PPP"): string => {
    if (!date) return "N/A";
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    
    // Simple formatting for now - could use date-fns if added
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const getTimeAgo = (date: string | Date | number): string => {
    if (!date) return "N/A";
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};
