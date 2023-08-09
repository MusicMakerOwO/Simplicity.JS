/*
member.roles.forEach(role => {
    console.log(role.name);
});

for (let role of member.roles) {
    console.log(role.name);
}

member.roles.add('123456789012345678');
member.roles.add(['123456789012345678', '123456789012345678']);
member.roles.add('123456789012345678', '123456789012345678');

member.roles.remove('123456789012345678');
member.roles.remove(['123456789012345678', '123456789012345678']);
member.roles.remove('123456789012345678', '123456789012345678');

member.roles.find('some name' or '123456789012345678');
member.roles.has('some name' or '123456789012345678');

member.roles.some([ 'some name', 'some other name', '123456789012345678', '123456789012345678' ]);
member.roles.some('some name', 'some other name', '123456789012345678', '123456789012345678');
member.roles.any(*same as above*)

member.roles.every([ 'some name', 'some other name', '123456789012345678', '123456789012345678' ]);
member.roles.every('some name', 'some other name', '123456789012345678', '123456789012345678');
member.roles.all(*same as above*)
member.roles.none(*opposite of every*)

member.roles.filter('some name' or '123456789012345678');
member.roles.find(*same as above*)
*/

module.exports = class MemberRoles {
    constructor (roles, member, client) {
        this.roles = roles || [];
        this.client = client;
        this.member = member;
        this.guildID = member.guildID;
    }

    async add (...roles) {
        for (let role of roles) {
            if (Array.isArray(role)) {
                await this.add(...role);
                continue;
            }

            let r = null;
            switch (typeof role) {
                case 'string':
                    r = await this.client.roles.get(role);
                    break;
                case 'object':
                    if (!role.id) throw new Error('Role object must have an ID');
                    r = await this.client.roles.get(role.id);
                    break;
                default:
                    throw new Error('Role must be a string or an object - Received: ' + typeof role);
            }

            if (!r) throw new Error(`Role not found - ${role}`);

            if (this.roles.map(r => r.id).includes(r.id)) continue;

            this.roles.push(r);
        }

        await this.client.API.edit(`/guilds/${this.member.guildID}/members/${this.member.id}`, {
            roles: this.roles.map(r => r.id)
        });
    }


    async remove (...roles) {
        for (let role of roles) {
            if (Array.isArray(role)) {
                await this.remove(...role);
                continue;
            }

            let r = null;
            switch (typeof role) {
                case 'string':
                    r = await this.client.roles.get(role);
                    break;
                case 'object':
                    if (!role.id) throw new Error('Role object must have an ID');
                    r = await this.client.roles.get(role.id);
                    break;
                default:
                    throw new Error('Role must be a string or an object - Received: ' + typeof role);
            }

            if (!r) throw new Error(`Role not found - ${role}`);

            if (!this.roles.map(r => r.id).includes(r.id)) continue;

            this.roles.splice(this.roles.indexOf(r.id), 1);
        }

        await this.client.API.edit(`/guilds/${this.member.guildID}/members/${this.member.id}`, {
            roles: this.roles.map(r => r.id)
        });
    }

    find (role) {
        return this.roles.filter(r => r.name === role || r.id === role);
    }

    filter (role) {
        return this.find(role);
    }

    has (role) {
        return this.roles.some(r => r.name === role || r.id === role);
    }

    some (...roles) {
        for (let role of roles) {
            if (Array.isArray(role)) {
                if (this.some(...role)) return true;
                continue;
            }

            if (this.roles.some(r => r.name === role || r.id === role)) return true;
        }

        return false;
    }

    any (...roles) {
        return this.some(...roles);
    }

    every (...roles) {
        for (let role of roles) {
            if (Array.isArray(role)) {
                if (!this.every(...role)) return false;
                continue;
            }

            if (!this.roles.some(r => r.name === role || r.id === role)) return false;
        }

        return true;
    }

    all (...roles) {
        return this.every(...roles);
    }

    none (...roles) {
        return !this.every(...roles);
    }

    toArray() {
        return this.roles;
    }

    map(fn) {
        return this.roles.map(fn);
    }

    *[Symbol.iterator] () {
        yield* this.roles;
    }

}