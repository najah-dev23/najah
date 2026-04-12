import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getValue } from '@/_common/helpers/code/customCode.js';
import { useBackAuthStore } from '@/pinia/backAuth.js';

function formatSession(session) {
    const _session = { ...session };
    delete _session.user;
    return _session;
}

function buildSelectString(columns: any, joinTypes: any = {}): string {
    if (!columns || columns === '*') return '*';
    if (Array.isArray(columns)) return columns.join(', ') || '*';

    const rootCols: string[] = [];
    const joinFragments: string[] = [];

    for (const [key, val] of Object.entries(columns)) {
        if (key === '*') { rootCols.push('*'); continue; }

        if (val === true) {
            rootCols.push(key);
        } else if (typeof val === 'object' && val !== null) {
            const nestedVal = (val as any).$value || val;
            let colStr = '*';
            if (nestedVal && typeof nestedVal === 'object') {
                const nestedCols = Object.keys(nestedVal).filter(k => k !== '$alias' && k !== '$value');
                colStr = nestedCols.length ? nestedCols.join(', ') : '*';
            }

            const tableName = key.includes('__') ? key.split('__')[0] : key;
            const hint = joinTypes[key] === 'inner' ? '!inner' : '';
            joinFragments.push(`${tableName}${hint}(${colStr})`);
        }
    }

    return [...rootCols, ...joinFragments].join(', ') || '*';
}

function applyFilters(query, filters) {
    if (!filters?.length) return query;

    for (const filter of filters) {
        if (!filter.isEnabled) continue;

        const { fn, column, value, operator, options } = filter;

        if (fn === 'match') {
            if (value) query = query.match(value);
        } else if (fn === 'or') {
            if (value) query = query.or(value);
        } else if (fn === 'not' && column && operator && value !== undefined) {
            query = query.not(column, operator, value);
        } else if (fn === 'filter' && column && operator && value !== undefined) {
            query = query.filter(column, operator, value);
        } else if (fn === 'textSearch' && column && value) {
            query = query.textSearch(column, value, { config: options?.config || 'english' });
        } else if (fn === 'in' && column && Array.isArray(value) && value.length) {
            query = query.in(column, value);
        } else if (fn === 'is' && column && value !== undefined) {
            query = query.is(column, value);
        } else if (column && value !== undefined && value !== '') {
            query = query[fn](column, value);
        }
    }

    return query;
}

const POSTGREST_OP_OVERRIDES: Record<string, string> = {
    contains: 'cs', containedBy: 'cd', overlaps: 'ov', textSearch: 'fts',
};

function conditionToPostgrest(c: any): string | null {
    const { operator, value } = c;
    const column = Array.isArray(c.field) ? c.field.join('.') : c.field;
    if (!column || !operator || value === undefined || value === '') return null;
    if (c.isEmptyIgnored && value === null) return null;

    const op = POSTGREST_OP_OVERRIDES[operator] || operator;

    if (operator === 'in') {
        const vals = Array.isArray(value) ? value.join(',') : String(value);
        return `${column}.in.(${vals})`;
    }
    if (operator === 'contains' || operator === 'containedBy' || operator === 'overlaps') {
        const vals = Array.isArray(value) ? value.join(',') : String(value);
        return `${column}.${op}.{${vals}}`;
    }
    if (operator === 'textSearch') {
        return `${column}.fts.${value}`;
    }

    return `${column}.${op}.${value}`;
}

function groupToPostgrest(group: any): string {
    const parts = (group.conditions || [])
        .map((c: any) => c.link ? groupToPostgrest(c) : conditionToPostgrest(c))
        .filter(Boolean);

    if (group.link === '$or') return parts.join(',');
    return parts.length > 1 ? `and(${parts.join(',')})` : parts[0] || '';
}

function applyDataFilter(query: any, filter: any): any {
    if (!filter?.conditions?.length) return query;

    if (filter.link === '$or') {
        const expr = groupToPostgrest(filter);
        if (expr) query = query.or(expr);
    } else {
        for (const condition of filter.conditions) {
            if (condition.link) {
                if (condition.link === '$or') {
                    const expr = groupToPostgrest(condition);
                    if (expr) query = query.or(expr);
                } else {
                    query = applyDataFilter(query, condition);
                }
            } else {
                const { operator, value } = condition;
                const column = Array.isArray(condition.field) ? condition.field.join('.') : condition.field;
                if (!column || !operator) continue;
                if (value === undefined || value === '') continue;
                if (condition.isEmptyIgnored && value === null) continue;

                query = query[operator](column, value);
            }
        }
    }

    return query;
}

export default {
    connection: {
        init: async ({ connection }) => {
            if (!connection) throw new Error('Supabase connection is required');

            const client = createClient(
                connection.config.customDomain ||
                    `https://${connection.config.branchRef || connection.config.projectRef}.supabase.co`,
                connection.config.publishableKey
            );

            const backAuthStore = useBackAuthStore(wwLib.$pinia);
            client.auth.onAuthStateChange(async (event, session) => {
                if (backAuthStore.connectionId !== connection.id) return
                switch (event) {
                    case 'INITIAL_SESSION':
                        return;
                    case 'SIGNED_OUT':
                        backAuthStore.clearAuthSession();
                        return;
                    case 'USER_UPDATED':
                        backAuthStore.setAuthUser(session.user);
                        return;
                    case 'SIGNED_IN':
                        if (session?.access_token === backAuthStore.session?.access_token) return;
                        await backAuthStore.setAuthSession(formatSession(session), { persist: true });
                        backAuthStore.setAuthUser(session.user);
                        return;
                }
            });

            return client;
        },
    },
    async loadView({
        tableConfig,
        viewConfig = {},
        parameters = {},
        instance,
    }: {
        tableConfig: any;
        viewConfig: any;
        parameters: any;
        instance: SupabaseClient;
    }) {
        if (!instance) throw new Error('Supabase instance is required');
        if (!tableConfig?.table) throw new Error('Table name is required');
        const processedViewConfig = getValue(viewConfig, { parameters });

        processedViewConfig.offset = parameters?.offset ?? processedViewConfig.offset ?? 0;
        processedViewConfig.limit = parameters?.limit ?? processedViewConfig.limit;

        const selectString = buildSelectString(processedViewConfig.columns, processedViewConfig.joinTypes);
        let query = instance
            .from(tableConfig.table)
            .select(selectString, { count: processedViewConfig.count ?? 'exact' });

        if (processedViewConfig.filters?.link) {
            query = applyDataFilter(query, processedViewConfig.filters);
        } else if (processedViewConfig.filters?.length) {
            query = applyFilters(query, processedViewConfig.filters);
        }

        for (const item of processedViewConfig.sort || []) {
            const column = Array.isArray(item.field) ? item.field.join('.') : item.field;
            if (column) query = query.order(column, { ascending: item.direction !== 'DESC' });
        }

        if (processedViewConfig.limit) query = query.limit(processedViewConfig.limit);
        if (processedViewConfig.offset && processedViewConfig.limit)
            query = query.range(processedViewConfig.offset, processedViewConfig.offset + processedViewConfig.limit - 1);
        const { data, error, count } = await query;
        const nextOffset = processedViewConfig.offset + (data?.length || 0);

        if (error) throw error;
        return {
            data: data || [],
            metadata: {
                limit: processedViewConfig.limit || null,
                offset: processedViewConfig.offset,
                nextOffset: nextOffset >= count ? null : nextOffset,
                total: count || null,
            },
        };
    },
    hooks: {
        'auth-refresh': async ({ session, instance }: { session?: any; instance?: SupabaseClient } = {}) => {
            if (!instance) throw new Error('Supabase instance is required');
            const backAuthStore = useBackAuthStore(wwLib.$pinia);
            if (!session) {
                const { data } = await instance.auth.getSession();
                backAuthStore.setAuthSession(formatSession(data.session), { persist: true });
            }
            const { data } = await instance.auth.getUser();
            backAuthStore.setAuthUser(data.user);
        },
    },
    actions: {
        select: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const selectString = buildSelectString(args.columns, args.joinTypes);
            let query = instance.from(args.table).select(selectString, args.count ? { count: args.count } : {});

            query = applyDataFilter(query, args.filters);

            for (const item of args.sort || []) {
                const column = Array.isArray(item.field) ? item.field.join('.') : item.field;
                if (column) query = query.order(column, { ascending: item.direction !== 'DESC' });
            }
            if (args.limit && args.offset) query = query.range(args.offset, args.offset + args.limit - 1);
            else if (args.limit) query = query.limit(args.limit);
            if (args.single) query = query.single() as any;
            else if (args.maybeSingle) query = query.maybeSingle() as any;

            const { data, error, count } = await query;
            if (error) throw error;
            return args.count ? { data, count } : data;
        },
        insert: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const selectColumns = (args.returnColumns || []).join(',') || '*';
            const { data, error } = await instance.from(args.table).insert(args.data).select(selectColumns);

            if (error) throw error;
            return data;
        },
        update: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const selectColumns = (args.returnColumns || []).join(',') || '*';
            let query = instance.from(args.table).update(args.data);
            query = applyDataFilter(query, args.filters);
            const { data, error, count } = await query.select(selectColumns);

            if (error) throw error;
            return args.count ? { data, count } : data;
        },
        upsert: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const selectColumns = (args.returnColumns || []).join(',') || '*';
            const { data, error } = await instance
                .from(args.table)
                .upsert(args.data, {
                    onConflict: args.onConflict?.join(','),
                    ignoreDuplicates: args.ignoreDuplicates,
                })
                .select(selectColumns);

            if (error) throw error;
            return data;
        },
        delete: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const selectColumns = (args.returnColumns || []).join(',') || '*';
            let query = instance.from(args.table).delete();
            query = applyDataFilter(query, args.filters);
            const { data, error } = await query.select(selectColumns);

            if (error) throw error;
            return data;
        },
        'storage-list': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).list(args.path, {
                limit: args.limit,
                offset: args.offset,
                search: args.search,
                sortBy: args.sortBy,
            });

            if (error) throw error;
            return data;
        },
        'storage-upload': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).upload(args.path, args.fileBody, {
                upsert: args.upsert,
                contentType: args.contentType,
                cacheControl: args.cacheControl,
            });

            if (error) throw error;
            return data;
        },
        'storage-remove': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).remove(args.paths);

            if (error) throw error;
            return data;
        },
        'storage-create-signed-url': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).createSignedUrl(args.path, args.expiresIn);

            if (error) throw error;
            return data;
        },
        'storage-get-public-url': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data } = instance.storage.from(args.id).getPublicUrl(args.path, {
                download: args.download,
                transform: args.transform,
            });

            return data;
        },
        'storage-copy': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');
            const { data, error } = await instance.storage.from(args.id).copy(args.fromPath, args.toPath);

            if (error) throw error;
            return data;
        },
        'storage-move': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).move(args.fromPath, args.toPath);

            if (error) throw error;
            return data;
        },
        'storage-update': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).update(args.path, args.fileBody, {
                contentType: args.contentType,
                cacheControl: args.cacheControl,
            });

            if (error) throw error;
            return data;
        },
        'storage-download': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.storage.from(args.id).download(args.path);

            if (error) throw error;
            return data;
        },
        rpc: async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            let query = instance.rpc(args.fn, args.params);
            if (args.single) query = query.single() as any;
            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        'functions-invoke': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.functions.invoke(args.functionName, {
                method: args.method,
                body: args.body,
                headers: args.headers,
            });

            if (error) throw error;
            return data;
        },
        // Auth actions
        'auth-sign-in-with-password': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.signInWithPassword({
                email: args.email,
                password: args.password,
                options: args.options,
            });

            if (error) throw error;
            return data;
        },
        'auth-sign-up': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.signUp({
                email: args.email,
                password: args.password,
                options: args.options,
            });

            if (error) throw error;
            return data;
        },
        'auth-get-user': async (_, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.getUser();

            if (error) throw error;
            return data;
        },
        'auth-sign-in-with-oauth': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.signInWithOAuth({
                provider: args.provider,
                options: args.options,
            });

            if (error) throw error;
            return data;
        },
        'auth-sign-out': async (_, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { error } = await instance.auth.signOut();

            if (error) throw error;
        },
        'auth-sign-in-with-otp': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.signInWithOtp({
                email: args.email,
                options: args.options,
            });

            if (error) throw error;
            return data;
        },
        'auth-verify-otp': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.verifyOtp({
                email: args.email,
                token: args.token,
                type: args.type,
                options: args.options,
            });

            if (error) throw error;
            return data;
        },
        'auth-reset-password-for-email': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.resetPasswordForEmail(args.email, {
                redirectTo: args.redirectTo,
                captchaToken: args.captchaToken,
            });

            if (error) throw error;
            return data;
        },
        'auth-update-user': async ({ args }, { instance }: { instance: SupabaseClient }) => {
            if (!instance) throw new Error('Supabase instance is required');

            const { data, error } = await instance.auth.updateUser({
                email: args.email,
                password: args.password,
                data: args.data,
            });

            if (error) throw error;
            return data;
        },
    },
};
