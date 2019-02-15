import { Store, UserInfo, UserId } from './model';

function newUser(id: UserId): UserInfo {
    return {
        id: id,
        records: [],
    };
}

function userForId(store: Store, id: number): UserInfo | undefined {
    return store.users[id];
}

const userStore: Store = {
    users: {},
};

export function getOrCreateUser(id: number): UserInfo {
    let user = userForId(userStore, id);
    if (!user) {
        user = newUser(id);
        userStore.users[id] = user;
    }

    return user;
}

export function updateUser(user: UserInfo) {
    userStore.users[user.id] = user;
}
