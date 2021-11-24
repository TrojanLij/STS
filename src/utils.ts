export function pushUniq<T>(array: T[], item: T) {
    const index = array.indexOf(item);

    if (index === -1) {
        array.push(item);
        return array.length;
    } else {
        return index + 1;
    }
}

export function removeItem<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index !== -1) {
        items.splice(index, 1);
        return true;
    } else {
        return false;
    }
}
