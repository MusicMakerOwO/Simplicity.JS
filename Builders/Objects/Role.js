/*
name	string	name of the role, max 100 characters	"new role"
permissions	string	bitwise value of the enabled/disabled permissions	@everyone permissions in guild
color	integer	RGB color value	0
hoist	boolean	whether the role should be displayed separately in the sidebar	false
icon	?image data	the role's icon image (if the guild has the ROLE_ICONS feature)	null
unicode_emoji	?string	the role's unicode emoji as a standard emoji (if the guild has the ROLE_ICONS feature)	null
mentionable	boolean	whether the role should be mentionable	false
*/

const colors = {
    pureblue: 0x0000ff,
    purered: 0xff0000,
    puregreen: 0x00ff00,
    white: 0xffffff,
    black: 0x000000,
    aqua: 0x1abc9c,
    green: 0x57f287,
    blue: 0x3498db,
    yellow: 0xfee75c,
    purple: 0x9b59b6,
    luminousvividpink: 0xe91e63,
    fuchsia: 0xeb459e,
    gold: 0xf1c40f,
    orange: 0xe67e22,
    red: 0xed4245,
    grey: 0x95a5a6,
    navy: 0x34495e,
    darkaqua: 0x11806a,
    darkgreen: 0x1f8b4c,
    darkblue: 0x206694,
    darkpurple: 0x71368a,
    darkvividpink: 0xad1457,
    darkgold: 0xc27c0e,
    darkorange: 0xa84300,
    darkred: 0x992d22,
    darkgrey: 0x979c9f,
    darkergrey: 0x7f8c8d,
    lightgrey: 0xbcc0c0,
    darknavy: 0x2c3e50,
    blurple: 0x5865f2,
    greyple: 0x99aab5,
    darkbutnotblack: 0x2c2f33,
    notquiteblack: 0x23272a,
    
    random: Math.floor(Math.random() * 0xffffff) + 1
}

const Permission = require('../../Constants/Permission.js');
const ClosestMatch = require('../../Utils/ClosestMatch.js');
const logs = require('../../Utils/Logs.js');

module.exports = class Role {
    constructor() {
        this.name = 'New Role';
        this.permissions = 0;
        this.color = 0x000000;
        this.hoist = false;
        this.mentionable = true;
        this.icon = null;
        this.unicodeEmoji = null;
    }

    setName(name) {
        if (typeof name !== 'string') throw new Error('Invalid name - Must be a string');
        if (name.length > 100) throw new Error('Invalid name - Must be less than 100 characters');
        this.name = name;
        return this;
    }

    setPermissions(...permissions) {
        if (permissions.length === 0) throw new Error('Invalid permissions - Must be a permission or an array of permissions');

        if (permissions.length === 1 && typeof permissions[0] === 'number') {
            this.permissions = permissions[0];
            return this;
        }

        let PermissionBitField = 0
        for (const permission of permissions) {
            if (typeof permission !== "string") throw new Error('Invalid permissions - Must be a permission or an array of permissions');
            if (!Permission[permission]) {
                const closest = ClosestMatch(permission, Object.keys(Permission));
                logs.warn(`Invalid permission ${permission} - Did you mean ${closest}?`);
                PermissionBitField |= Permission[closest];
            }
            PermissionBitField |= Permission[permission];
        }
        this.permissions = PermissionBitField;
        return this;
    }

    setColor(color) {

        if (color === null) {
            this.color = 0x000000;
            return this;
        }

        if (color === undefined) {
            this.color = colors.random;
            return this;
        }

        if (typeof color === 'string') {
            if (!colors[color.toLowerCase()]) throw new RangeError('Color must be a valid color name');

            const colorRegex = /^(?:#|0x)?([0-9a-fA-F]{6})$/;
            const match = color.match(colorRegex);

            if (match) {
                this.color = parseInt(match[1], 16);
                return this;
            }

            if (colors[color.toLowerCase()]) {
                this.color = colors[color.toLowerCase()];
            } else {
                const closest = ClosestMatch(color, Object.keys(colors));
                logs.warn(`Invalid color ${color} - Did you mean ${closest}?`);
                this.color = colors[closest];
            }

            return this;
        }

        if (typeof color === 'number') {
            if (color < 0 || color > 0xffffff) throw new RangeError('Color must be a valid color code');
            this.color = color;
            return this;
        }

        if (Array.isArray(color)) {
            if (color.length !== 3) throw new RangeError('Color array must be 3 elements long');
            if (color.some(c => c < 0 || c > 255)) throw new RangeError('Color array elements must be between 0 and 255');
            color = (color[0] << 16) + (color[1] << 8) + color[2];
            this.color = color;
        }


    }

}