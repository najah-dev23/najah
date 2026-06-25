function isPlainObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function buildColumnSelection(columns: unknown, joinTypes: Record<string, unknown> = {}, path: string[] = []): string {
    if (!columns || columns === true || columns === '*') return '*';
    if (Array.isArray(columns)) return columns.filter(column => typeof column === 'string').join(', ') || '*';
    if (!isPlainObject(columns)) return '*';

    const columnFragments: string[] = [];

    for (const [key, val] of Object.entries(columns)) {
        if (key.startsWith('$') || val === false) continue;
        if (key === '*') {
            columnFragments.push('*');
            continue;
        }

        if (val === true) {
            columnFragments.push(key);
        } else if (isPlainObject(val) || Array.isArray(val)) {
            const nestedVal = isPlainObject(val) && Object.hasOwn(val, '$value') ? val.$value : val;
            const alias = isPlainObject(val) && typeof val.$alias === 'string' ? val.$alias : null;
            const relationName = isPlainObject(val) ? getRelationName(key, val, alias) : key;
            const fragmentKey = getRelationFragmentKey(key, relationName, alias);
            const nextPath = [...path, key];
            const hint = joinTypes[nextPath.join('.')] === 'inner' ? '!inner' : '';
            columnFragments.push(`${fragmentKey}${hint}(${buildColumnSelection(nestedVal, joinTypes, nextPath)})`);
        }
    }

    return columnFragments.join(', ') || '*';
}

function getRelationName(key: string, value: Record<string, unknown>, alias?: string | null) {
    const nestedValue = isPlainObject(value.$value) ? value.$value : null;
    const relation =
        (typeof value.$relation === 'string' && value.$relation) ||
        (typeof value.$relationName === 'string' && value.$relationName) ||
        (typeof nestedValue?.$relation === 'string' && nestedValue.$relation) ||
        (typeof nestedValue?.$relationName === 'string' && nestedValue.$relationName);

    if (relation) return relation;
    if (key.includes('__')) return key.split('__')[0];
    return alias || key;
}

function getRelationFragmentKey(key: string, relationName: string, alias?: string | null) {
    if (alias) return alias === relationName ? relationName : `${alias}:${relationName}`;
    return key === relationName ? relationName : `${key}:${relationName}`;
}

export function buildSelectString(columns: unknown, joinTypes: Record<string, unknown> = {}): string {
    return buildColumnSelection(columns, joinTypes);
}
