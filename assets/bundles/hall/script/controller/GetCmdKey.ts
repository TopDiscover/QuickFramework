export function GetCmdKey(...args: any[]): string {
    let total = ""
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] == "number") {
            total += String(args[i])
            continue
        }
        total += args[i]
    }
    return total
}