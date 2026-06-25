import { describe, expect, it } from 'vitest';

import { buildSelectString } from './supabase.select';

describe('Supabase buildSelectString', () => {
    it('serializes legacy nested array columns without array indexes', () => {
        expect(
            buildSelectString({
                user_id: true,
                post_id: ['title', 'content'],
            })
        ).toBe('user_id, post_id(title, content)');
    });

    it('uses the relation alias as the legacy relation name fallback', () => {
        expect(
            buildSelectString({
                post_id: { $alias: 'posts', $value: ['title'] },
            })
        ).toBe('posts(title)');
    });

    it('uses Supabase relation metadata with custom response aliases', () => {
        expect(
            buildSelectString(
                {
                    id: true,
                    post_id: {
                        $alias: 'post',
                        $relation: 'posts',
                        $value: { title: true, content: true },
                    },
                },
                { post_id: 'inner' }
            )
        ).toBe('id, post:posts!inner(title, content)');
    });

    it('serializes separated foreign key columns and relation metadata', () => {
        expect(
            buildSelectString({
                id: true,
                post_id: true,
                post_id__posts: {
                    $alias: 'posts',
                    $relation: 'posts',
                    $value: { title: true, content: true },
                },
            })
        ).toBe('id, post_id, posts(title, content)');
    });

    it('aliases relation metadata back to the config key when no response alias is set', () => {
        expect(
            buildSelectString({
                post_id: { $relation: 'posts', title: true },
            })
        ).toBe('post_id:posts(title)');
    });

    it('serializes nested Supabase relation metadata recursively', () => {
        expect(
            buildSelectString({
                id: true,
                post_id: {
                    $alias: 'posts',
                    $relation: 'posts',
                    $value: {
                        profile: {
                            $alias: 'profiles',
                            $relation: 'profiles',
                            $value: '*',
                        },
                    },
                },
            })
        ).toBe('id, posts(profiles(*))');
    });

    it('serializes nested separated relation metadata recursively', () => {
        expect(
            buildSelectString({
                id: true,
                post_id: true,
                post_id__posts: {
                    $alias: 'posts',
                    $relation: 'posts',
                    $value: {
                        profile: true,
                        profile__profiles: {
                            $alias: 'profiles',
                            $relation: 'profiles',
                            $value: '*',
                        },
                    },
                },
            })
        ).toBe('id, post_id, posts(profile, profiles(*))');
    });

    it('serializes nested inner joins from path join types', () => {
        expect(
            buildSelectString(
                {
                    id: true,
                    post_id__posts: {
                        $alias: 'posts',
                        $relation: 'posts',
                        $value: {
                            profile__profiles: {
                                $alias: 'profiles',
                                $relation: 'profiles',
                                $value: '*',
                            },
                        },
                    },
                },
                { 'post_id__posts.profile__profiles': 'inner' }
            )
        ).toBe('id, posts(profiles!inner(*))');
    });

    it('preserves all parent relation columns with nested relation metadata', () => {
        expect(
            buildSelectString({
                id: true,
                post_id: {
                    $alias: 'posts',
                    $relation: 'posts',
                    $value: {
                        '*': true,
                        profile: {
                            $alias: 'profiles',
                            $relation: 'profiles',
                            $value: '*',
                        },
                    },
                },
            })
        ).toBe('id, posts(*, profiles(*))');
    });
});
